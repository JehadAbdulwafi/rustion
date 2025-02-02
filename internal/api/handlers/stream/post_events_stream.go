package stream

import (
	"database/sql"
	"errors"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/JehadAbdulwafi/rustion/internal/util/subscription"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostStreamEventsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.POST("/events", postStreamEventsHandler(s))
}

func postStreamEventsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		var body types.StreamEvent
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		stream, err := s.Queries.GetStreamByEndpoint(ctx, *body.Stream)
		if err != nil {
			log.Error().Err(err).Msg("Failed to get stream")
			return echo.NewHTTPError(http.StatusNotFound, "Stream not found")
		}

		activeSub, err := s.Queries.GetUserActiveSubscription(ctx, stream.UserID)
		if err != nil {
			log.Error().Err(err).Msg("Failed to get user active subscription")
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get user active subscription")
		}

		switch *body.Action {
		case util.StreamActionPublish:
			values, err := url.ParseQuery(body.Param)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, "invalid param format")
			}

			password := values.Get("password")
			if password == "" {
				return echo.NewHTTPError(http.StatusBadRequest, "password is required")
			}

			if password != stream.Password {
				log.Error().Msg("Invalid password")
				return echo.NewHTTPError(http.StatusUnauthorized, "Unauthorized")
			}

			usageDate := time.Now().Truncate(24 * time.Hour)

			// Get current usage
			dailyUsage, err := s.Queries.GetDailyStreamingUsage(ctx, database.GetDailyStreamingUsageParams{
				UserID:    stream.UserID,
				UsageDate: usageDate,
			})
			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				// handle error
			}
			if errors.Is(err, sql.ErrNoRows) {
				dailyUsage = 0
			}

			planLimits := subscription.GetPlanLimits(strings.ToLower(activeSub.PlanName))

			if dailyUsage >= int32(planLimits.MaxStreamingMinutesPerDay) {
				return echo.NewHTTPError(http.StatusForbidden, "Daily limit exceeded")
			}

			err = s.Queries.PublishStream(ctx, stream.ID)
			if err != nil {
				log.Error().Err(err).Msg("Failed to publish stream")
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to publish stream")
			}
			// Broadcast status update to all connected clients
			BroadcastStreamStatus(s, stream.ID)

		case util.StreamActionUnpublish:
			// Get the stream's last published time to calculate duration
			streamInfo, err := s.Queries.GetStreamById(ctx, stream.ID)
			if err != nil {
				log.Error().Err(err).Msg("Failed to get stream info")
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get stream info")
			}

			// Calculate duration since last checked time
			duration := time.Since(streamInfo.LastCheckedTime)
			minutes := int32(duration.Minutes())

			// Update daily streaming usage
			err = s.Queries.UpdateDailyStreamingUsage(ctx, database.UpdateDailyStreamingUsageParams{
				UserID:               streamInfo.UserID,
				SubscriptionID:       activeSub.ID,
				StreamingMinutesUsed: minutes,
				UsageDate:            time.Now().UTC().Truncate(24 * time.Hour),
			})
			if err != nil {
				log.Error().Err(err).Msg("Failed to update streaming usage")
			}

			err = s.Queries.UnpublishStream(ctx, stream.ID)
			if err != nil {
				log.Error().Err(err).Msg("Failed to unpublish stream")
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to unpublish stream")
			}
			// Broadcast status update to all connected clients
			BroadcastStreamStatus(s, stream.ID)

		default:
			log.Info().Str("action", *body.Action).Msg("invalid action")
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
