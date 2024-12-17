package config

import (
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/mailer/transport"
	"github.com/JehadAbdulwafi/rustion/internal/push"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/rs/zerolog"
)

type EchoServer struct {
	Debug                          bool
	ListenAddress                  string
	HideInternalServerErrorDetails bool
	BaseURL                        string
	EnableCORSMiddleware           bool
	EnableLoggerMiddleware         bool
	EnableRecoverMiddleware        bool
	EnableRequestIDMiddleware      bool
	EnableTrailingSlashMiddleware  bool
	EnableSecureMiddleware         bool
	EnableCacheControlMiddleware   bool
	SecureMiddleware               EchoServerSecureMiddleware
}

// EchoServerSecureMiddleware represents a subset of echo's secure middleware config relevant to the app server.
// https://github.com/labstack/echo/blob/master/middleware/secure.go
type EchoServerSecureMiddleware struct {
	XSSProtection         string
	ContentTypeNosniff    string
	XFrameOptions         string
	HSTSMaxAge            int
	HSTSExcludeSubdomains bool
	ContentSecurityPolicy string
	CSPReportOnly         bool
	HSTSPreloadEnabled    bool
	ReferrerPolicy        string
}

type AuthServer struct {
	AccessTokenValidity                time.Duration
	RefreshTokenValidity               time.Duration
	PasswordResetTokenValidity         time.Duration
	PasswordResetTokenDebounceDuration time.Duration
	PasswordResetTokenReuseDuration    time.Duration
	DefaultUserScopes                  []string
	LastAuthenticatedAtThreshold       time.Duration
}

type PushService struct {
	UseFCMProvider bool
}

type FrontendServer struct {
	BaseURL               string
	PasswordResetEndpoint string
}

type LoggerServer struct {
	Level              zerolog.Level
	RequestLevel       zerolog.Level
	LogRequestBody     bool
	LogRequestHeader   bool
	LogRequestQuery    bool
	LogResponseBody    bool
	LogResponseHeader  bool
	LogCaller          bool
	PrettyPrintConsole bool
}

type Server struct {
	Database  Database
	Echo      EchoServer
	Auth      AuthServer
	Frontend  FrontendServer
	Logger    LoggerServer
	Push      PushService
	FCMConfig push.FCMConfig
	Mailer    Mailer
	SMTP      transport.SMTPMailTransportConfig
}

func DefaultServiceConfigFromEnv() Server {
	DotEnvLoad(filepath.Join(util.GetProjectRootDir(), "../.env"), os.Setenv)

	return Server{
		Database: Database{
			Host:     util.GetEnv("PGHOST", "localhost"),
			Port:     util.GetEnvAsInt("PGPORT", 5432),
			Database: util.GetEnv("PGDATABASE", "rustion"),
			Username: util.GetEnv("PGUSER", "postgres"),
			Password: util.GetEnv("PGPASSWORD", "996100"),
			AdditionalParams: map[string]string{
				"sslmode": util.GetEnv("PGSSLMODE", "disable"),
			},
			MaxOpenConns:    util.GetEnvAsInt("DB_MAX_OPEN_CONNS", runtime.NumCPU()*2),
			MaxIdleConns:    util.GetEnvAsInt("DB_MAX_IDLE_CONNS", 1),
			ConnMaxLifetime: time.Second * time.Duration(util.GetEnvAsInt("DB_CONN_MAX_LIFETIME_SEC", 60)),
		},
		Echo: EchoServer{
			Debug:                          util.GetEnvAsBool("SERVER_ECHO_DEBUG", false),
			ListenAddress:                  util.GetEnv("SERVER_ECHO_LISTEN_ADDRESS", "192.168.1.2:9973"),
			HideInternalServerErrorDetails: util.GetEnvAsBool("SERVER_ECHO_HIDE_INTERNAL_SERVER_ERROR_DETAILS", true),
			BaseURL:                        util.GetEnv("SERVER_ECHO_BASE_URL", "http://localhost:8080"),
			EnableCORSMiddleware:           util.GetEnvAsBool("SERVER_ECHO_ENABLE_CORS_MIDDLEWARE", true),
			EnableLoggerMiddleware:         util.GetEnvAsBool("SERVER_ECHO_ENABLE_LOGGER_MIDDLEWARE", true),
			EnableRecoverMiddleware:        util.GetEnvAsBool("SERVER_ECHO_ENABLE_RECOVER_MIDDLEWARE", true),
			EnableRequestIDMiddleware:      util.GetEnvAsBool("SERVER_ECHO_ENABLE_REQUEST_ID_MIDDLEWARE", true),
			EnableTrailingSlashMiddleware:  util.GetEnvAsBool("SERVER_ECHO_ENABLE_TRAILING_SLASH_MIDDLEWARE", true),
			EnableSecureMiddleware:         util.GetEnvAsBool("SERVER_ECHO_ENABLE_SECURE_MIDDLEWARE", true),
			EnableCacheControlMiddleware:   util.GetEnvAsBool("SERVER_ECHO_ENABLE_CACHE_CONTROL_MIDDLEWARE", true),
			// see https://echo.labstack.com/middleware/secure
			// see https://github.com/labstack/echo/blob/master/middleware/secure.go
			SecureMiddleware: EchoServerSecureMiddleware{
				XSSProtection:         util.GetEnv("SERVER_ECHO_SECURE_MIDDLEWARE_XSS_PROTECTION", "1; mode=block"),
				ContentTypeNosniff:    util.GetEnv("SERVER_ECHO_SECURE_MIDDLEWARE_CONTENT_TYPE_NOSNIFF", "nosniff"),
				XFrameOptions:         util.GetEnv("SERVER_ECHO_SECURE_MIDDLEWARE_X_FRAME_OPTIONS", "SAMEORIGIN"),
				HSTSMaxAge:            util.GetEnvAsInt("SERVER_ECHO_SECURE_MIDDLEWARE_HSTS_MAX_AGE", 0),
				HSTSExcludeSubdomains: util.GetEnvAsBool("SERVER_ECHO_SECURE_MIDDLEWARE_HSTS_EXCLUDE_SUBDOMAINS", false),
				ContentSecurityPolicy: util.GetEnv("SERVER_ECHO_SECURE_MIDDLEWARE_CONTENT_SECURITY_POLICY", ""),
				CSPReportOnly:         util.GetEnvAsBool("SERVER_ECHO_SECURE_MIDDLEWARE_CSP_REPORT_ONLY", false),
				HSTSPreloadEnabled:    util.GetEnvAsBool("SERVER_ECHO_SECURE_MIDDLEWARE_HSTS_PRELOAD_ENABLED", false),
				ReferrerPolicy:        util.GetEnv("SERVER_ECHO_SECURE_MIDDLEWARE_REFERRER_POLICY", ""),
			},
		},
		Auth: AuthServer{
			AccessTokenValidity:                time.Second * time.Duration(util.GetEnvAsInt("SERVER_AUTH_ACCESS_TOKEN_VALIDITY", 86400)),
			RefreshTokenValidity:               time.Second * time.Duration(util.GetEnvAsInt("SERVER_AUTH_ACCESS_TOKEN_VALIDITY", 604800)),
			PasswordResetTokenValidity:         time.Second * time.Duration(util.GetEnvAsInt("SERVER_AUTH_PASSWORD_RESET_TOKEN_VALIDITY", 900)),
			PasswordResetTokenDebounceDuration: time.Second * time.Duration(util.GetEnvAsInt("SERVER_AUTH_PASSWORD_RESET_TOKEN_DEBOUNCE_DURATION_SECONDS", 60)),
			PasswordResetTokenReuseDuration:    time.Second * time.Duration(util.GetEnvAsInt("SERVER_AUTH_PASSWORD_RESET_TOKEN_REUSE_DURATION_SECONDS", 0)),
			DefaultUserScopes:                  util.GetEnvAsStringArr("SERVER_AUTH_DEFAULT_USER_SCOPES", []string{"app"}),
			LastAuthenticatedAtThreshold:       time.Second * time.Duration(util.GetEnvAsInt("SERVER_AUTH_LAST_AUTHENTICATED_AT_THRESHOLD", 900)),
		},
		Logger: LoggerServer{
			Level:              util.LogLevelFromString(util.GetEnv("SERVER_LOGGER_LEVEL", zerolog.DebugLevel.String())),
			RequestLevel:       util.LogLevelFromString(util.GetEnv("SERVER_LOGGER_REQUEST_LEVEL", zerolog.DebugLevel.String())),
			LogRequestBody:     util.GetEnvAsBool("SERVER_LOGGER_LOG_REQUEST_BODY", false),
			LogRequestHeader:   util.GetEnvAsBool("SERVER_LOGGER_LOG_REQUEST_HEADER", false),
			LogRequestQuery:    util.GetEnvAsBool("SERVER_LOGGER_LOG_REQUEST_QUERY", false),
			LogResponseBody:    util.GetEnvAsBool("SERVER_LOGGER_LOG_RESPONSE_BODY", false),
			LogResponseHeader:  util.GetEnvAsBool("SERVER_LOGGER_LOG_RESPONSE_HEADER", false),
			LogCaller:          util.GetEnvAsBool("SERVER_LOGGER_LOG_CALLER", false),
			PrettyPrintConsole: util.GetEnvAsBool("SERVER_LOGGER_PRETTY_PRINT_CONSOLE", false),
		},
		Push: PushService{
			UseFCMProvider: util.GetEnvAsBool("SERVER_PUSH_USE_FCM", true),
		},
		FCMConfig: push.FCMConfig{
			GoogleApplicationCredentials: util.GetEnv("GOOGLE_APPLICATION_CREDENTIALS", ""),
			ProjectID:                    util.GetEnv("SERVER_FCM_PROJECT_ID", "no-fcm-project-id-set"),
			ValidateOnly:                 util.GetEnvAsBool("SERVER_FCM_VALIDATE_ONLY", true),
		},
		Frontend: FrontendServer{
			BaseURL:               util.GetEnv("SERVER_FRONTEND_BASE_URL", "http://localhost:3000"),
			PasswordResetEndpoint: util.GetEnv("SERVER_FRONTEND_PASSWORD_RESET_ENDPOINT", "/set-new-password"),
		},
		Mailer: Mailer{
			DefaultSender:               util.GetEnv("SERVER_MAILER_DEFAULT_SENDER", "support@rustion.com"),
			Send:                        util.GetEnvAsBool("SERVER_MAILER_SEND", true),
			WebTemplatesEmailBaseDirAbs: util.GetEnv("SERVER_MAILER_WEB_TEMPLATES_EMAIL_BASE_DIR_ABS", filepath.Join(util.GetProjectRootDir(), "../web/templates/email")), // /app/web/templates/email
			Transporter:                 util.GetEnvEnum("SERVER_MAILER_TRANSPORTER", MailerTransporterSMTP.String(), []string{MailerTransporterSMTP.String(), MailerTransporterMock.String()}),
		},
		SMTP: transport.SMTPMailTransportConfig{
			Host:      util.GetEnv("SERVER_SMTP_HOST", "localhost"),
			Port:      util.GetEnvAsInt("SERVER_SMTP_PORT", 1025),
			Username:  util.GetEnv("SERVER_SMTP_USERNAME", ""),
			Password:  util.GetEnv("SERVER_SMTP_PASSWORD", ""),
			AuthType:  transport.SMTPAuthTypeFromString(util.GetEnv("SERVER_SMTP_AUTH_TYPE", transport.SMTPAuthTypeNone.String())),
			UseTLS:    util.GetEnvAsBool("SERVER_SMTP_USE_TLS", false),
			TLSConfig: nil,
		},
	}

}
