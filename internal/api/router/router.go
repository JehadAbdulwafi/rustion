package router

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers"
	"github.com/JehadAbdulwafi/rustion/internal/api/middleware"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog/log"
)

func Init(s *api.Server) {
	s.Echo = echo.New()

	s.Echo.Debug = s.Config.Echo.Debug
	s.Echo.HideBanner = true
	s.Echo.Logger.SetOutput(&echoLogger{level: s.Config.Logger.RequestLevel, log: log.With().Str("component", "echo").Logger()})

	if s.Config.Echo.EnableSecureMiddleware {
		s.Echo.Use(echoMiddleware.SecureWithConfig(echoMiddleware.SecureConfig{
			Skipper:               echoMiddleware.DefaultSecureConfig.Skipper,
			XSSProtection:         s.Config.Echo.SecureMiddleware.XSSProtection,
			ContentTypeNosniff:    s.Config.Echo.SecureMiddleware.ContentTypeNosniff,
			XFrameOptions:         s.Config.Echo.SecureMiddleware.XFrameOptions,
			HSTSMaxAge:            s.Config.Echo.SecureMiddleware.HSTSMaxAge,
			HSTSExcludeSubdomains: s.Config.Echo.SecureMiddleware.HSTSExcludeSubdomains,
			ContentSecurityPolicy: s.Config.Echo.SecureMiddleware.ContentSecurityPolicy,
			CSPReportOnly:         s.Config.Echo.SecureMiddleware.CSPReportOnly,
			HSTSPreloadEnabled:    s.Config.Echo.SecureMiddleware.HSTSPreloadEnabled,
			ReferrerPolicy:        s.Config.Echo.SecureMiddleware.ReferrerPolicy,
		}))
	} else {
		log.Warn().Msg("Disabling secure middleware due to environment config")
	}

	if s.Config.Echo.EnableRequestIDMiddleware {
		s.Echo.Use(echoMiddleware.RequestID())
	} else {
		log.Warn().Msg("Disabling request ID middleware due to environment config")
	}

	if s.Config.Echo.EnableCORSMiddleware {
		s.Echo.Use(echoMiddleware.CORS())
	} else {
		log.Warn().Msg("Disabling CORS middleware due to environment config")
	}
	s.Echo.Use(RequestLoggerMiddleware)
	s.Echo.Static("/assets", "assets")

	s.Router = &api.Router{
		Routes: nil, // will be populated by handlers.AttachAllRoutes(s)
		Root:   s.Echo.Group("/api/v1"),

		APIV1Auth: s.Echo.Group("/api/v1/auth", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/auth/forgot-password",
					"/api/v1/auth/forgot-password/complete",
					"/api/v1/auth/login",
					"/api/v1/auth/refresh",
					"/api/v1/auth/register":
					return true
				}
				return false
			},
		})),

		APIV1Stream: s.Echo.Group("/api/v1/streams", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/streams/:id/ws":
					return true
				case "/api/v1/streams/events":
					return true
				case "/api/v1/streams/player-events":
					return true
				}
				return false
			},
		})),

		APIV1Faq: s.Echo.Group("/api/v1/faqs", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/faqs/:id":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/faqs":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				}
				return false
			},
		})),

		APIV1Feedback: s.Echo.Group("/api/v1/feedbacks", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/feedbacks/:id":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/feedbacks":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				}
				return false
			},
		})),

		APIV1App: s.Echo.Group("/api/v1/apps", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/apps/:id":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/apps":
					if c.Request().Method == http.MethodPost {
						return false
					}
					return true
				}
				return false
			},
		})),

		APIV1Articles: s.Echo.Group("/api/v1/articles", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/articles/:id":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/articles":
					if c.Request().Method == http.MethodPost {
						return false
					}
					return true
				}
				return false
			},
		})),

		APIV1Tags: s.Echo.Group("/api/v1/tags", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/tags/:id":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false

				case "/api/v1/tags/:id/articles":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false

				case "/api/v1/tags/articles":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/tags":
					if c.Request().Method == http.MethodPost {
						return false
					}
					return true
				}
				return false
			},
		})),

		APIV1FeaturedSections: s.Echo.Group("/api/v1/featured-sections", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/featured-sections/:id":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/featured-sections/:id/articles":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/featured-sections/articles":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/featured-sections":
					if c.Request().Method == http.MethodPost {
						return false
					}
					return true
				}
				return false
			},
		})),

		APIV1TvShows: s.Echo.Group("/api/v1/tv-shows", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/tv-shows/:id":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false

				case "/api/v1/tv-shows/:id/schedules":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false

				case "/api/v1/tv-shows/schedules":
					if c.Request().Method == http.MethodGet {
						return true
					}
					return false
				case "/api/v1/tv-shows":
					if c.Request().Method == http.MethodPost {
						return false
					}
					return true
				}
				return false
			},
		})),

		APIV1Push: s.Echo.Group("/api/v1/push", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/push/token":
					return true
				}
				return false
			},
		})),

		APIV1Channel: s.Echo.Group("/api/v1/channels", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeSubscriptionRequired,
		})),

		APIV1Subscription: s.Echo.Group("/api/v1/subscriptions", middleware.AuthWithConfig(middleware.AuthConfig{
			S:    s,
			Mode: middleware.AuthModeRequired,
			Skipper: func(c echo.Context) bool {
				switch c.Path() {
				case "/api/v1/subscriptions/plans":
					return true
				case "/api/v1/subscriptions/plans/:id":
					return true
				}
				return false
			},
		})),
	}
	handlers.AttachAllRoutes(s)
}
