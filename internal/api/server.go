package api

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/config"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/mailer"
	"github.com/JehadAbdulwafi/rustion/internal/mailer/transport"
	"github.com/JehadAbdulwafi/rustion/internal/push"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/JehadAbdulwafi/rustion/internal/util/subscription"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"

	// Import postgres driver for database/sql package
	_ "github.com/lib/pq"
)

type Router struct {
	Routes                []*echo.Route
	Root                  *echo.Group
	APIV1Auth             *echo.Group
	APIV1Push             *echo.Group
	APIV1Stream           *echo.Group
	APIV1Articles         *echo.Group
	APIV1Tags             *echo.Group
	APIV1FeaturedSections *echo.Group
	APIV1TvShows          *echo.Group
	APIV1App              *echo.Group
	APIV1Faq              *echo.Group
	APIV1Feedback         *echo.Group
	APIV1Channel          *echo.Group
	APIV1Subscription     *echo.Group
}

type Server struct {
	Config  config.Server
	DB      *sql.DB
	Queries *database.Queries
	Echo    *echo.Echo
	Router  *Router
	Push    *push.Service
	Mailer  *mailer.Mailer
}

func NewServer(config config.Server) *Server {
	s := &Server{
		Config: config,
		DB:     nil,
		Echo:   nil,
		Router: nil,
	}

	return s
}

func (s *Server) Ready() bool {
	return s.DB != nil &&
		s.Echo != nil &&
		s.Router != nil
}

func (s *Server) InitDB(ctx context.Context) error {
	db, err := sql.Open("postgres", s.Config.Database.ConnectionString())
	if err != nil {
		return err
	}

	if s.Config.Database.MaxOpenConns > 0 {
		db.SetMaxOpenConns(s.Config.Database.MaxOpenConns)
	}
	if s.Config.Database.MaxIdleConns > 0 {
		db.SetMaxIdleConns(s.Config.Database.MaxIdleConns)
	}
	if s.Config.Database.ConnMaxLifetime > 0 {
		db.SetConnMaxLifetime(s.Config.Database.ConnMaxLifetime)
	}

	if err := db.PingContext(ctx); err != nil {
		return err
	}

	queries := database.New(db)

	s.DB = db
	s.Queries = queries

	return nil
}

func (s *Server) InitPush() error {
	s.Push = push.New(s.Queries)

	if s.Config.Push.UseFCMProvider {
		fcmProvider, err := push.NewFCM(s.Config.FCMConfig)
		if err != nil {
			return err
		}
		s.Push.RegisterProvider(fcmProvider)
	}

	if s.Push.GetProviderCount() < 1 {
		log.Warn().Msg("No providers registered for push service")
	}

	return nil
}

func (s *Server) InitMailer() error {
	switch config.MailerTransporter(s.Config.Mailer.Transporter) {
	case config.MailerTransporterMock:
		log.Warn().Msg("Initializing mock mailer")
		s.Mailer = mailer.New(s.Config.Mailer, transport.NewMock())
	case config.MailerTransporterSMTP:
		s.Mailer = mailer.New(s.Config.Mailer, transport.NewSMTP(s.Config.SMTP))
	default:
		return fmt.Errorf("Unsupported mail transporter: %s", s.Config.Mailer.Transporter)
	}

	return s.Mailer.ParseTemplates()
}

func (s *Server) Start() error {
	if !s.Ready() {
		return errors.New("server is not ready")
	}

	return s.Echo.Start(s.Config.Echo.ListenAddress)
}

func (s *Server) Shutdown(ctx context.Context) error {
	log.Warn().Msg("Shutting down server")

	if s.DB != nil {
		log.Debug().Msg("Closing database connection")

		if err := s.DB.Close(); err != nil && !errors.Is(err, sql.ErrConnDone) {
			log.Error().Err(err).Msg("Failed to close database connection")
		}
	}

	log.Debug().Msg("Shutting down echo server")

	return s.Echo.Shutdown(ctx)
}

func (s *Server) StartBackgroundTasks() {
	go s.monitorStreamUsage()
}

func (s *Server) monitorStreamUsage() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		ctx := context.Background()
		streams, err := s.Queries.GetActiveStreams(ctx)
		if err != nil {
			log.Error().Err(err).Msg("Failed to get active streams")
			continue
		}

		for _, stream := range streams {
			s.checkStreamUsage(ctx, stream)
		}
	}
}

func (s *Server) checkStreamUsage(ctx context.Context, stream database.Stream) {
	// Get subscription details
	sub, err := s.Queries.GetUserActiveSubscription(ctx, stream.UserID)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get subscription")
		return
	}

	// Calculate time since last check
	now := time.Now()
	duration := now.Sub(stream.LastCheckedTime)
	minutes := int32(duration.Minutes())

	// Get user's current date
	usageDate := now.Truncate(24 * time.Hour)

	// Update usage
	err = s.Queries.UpdateDailyStreamingUsage(ctx, database.UpdateDailyStreamingUsageParams{
		UserID:               stream.UserID,
		SubscriptionID:       sub.ID,
		StreamingMinutesUsed: minutes,
		UsageDate:            usageDate,
	})
	if err != nil {
		log.Error().Err(err).Msg("Failed to update streaming usage")
	}

	planLimits := subscription.GetPlanLimits(strings.ToLower(sub.PlanName))

	// Check limit
	usage, err := s.Queries.GetDailyStreamingUsage(ctx, database.GetDailyStreamingUsageParams{
		UserID:    stream.UserID,
		UsageDate: usageDate,
	})
	if err == nil && usage >= int32(planLimits.MaxStreamingMinutesPerDay) {
		// Unpublish the stream
		s.KickoffStream(ctx, stream)
		err = s.Queries.UnpublishStream(ctx, stream.ID)
		if err != nil {
			log.Error().Err(err).Msg("Failed to unpublish stream")
			return
		}
	}

	s.Queries.UpdateStreamCheckTime(ctx, database.UpdateStreamCheckTimeParams{
		ID:              stream.ID,
		LastCheckedTime: now,
	})
}

func (s *Server) KickoffStream(c context.Context, stream database.Stream) {
	token, err := util.GetAuthToken(s.Config.Auth.StreamApiSecret, stream.Host)
	if err != nil {
		log.Error().Err(err).Msg("Failed to retrieve authentication token")
		return
	}

	requestBody := map[string]string{
		"vhost":  stream.Host,
		"app":    stream.App,
		"stream": stream.Endpoint,
	}

	jsonPayload, err := json.Marshal(requestBody)
	if err != nil {
		log.Error().Err(err).Msg("Failed to encode request body")
		return
	}

	responseData, err := util.RequestWithBody(token, stream.Host, "/terraform/v1/mgmt/streams/kickoff", jsonPayload)
	if err != nil {
		log.Error().Err(err).Msg("Failed to kick off stream")
		return
	}

	log.Debug().Interface("responseData", responseData).Msg("kickoff stream Response data")
}
