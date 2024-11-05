package router

import (
	"time"

	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type echoLogger struct {
	level zerolog.Level
	log   zerolog.Logger
}

func (l *echoLogger) Write(p []byte) (n int, err error) {
	l.log.WithLevel(l.level).Msgf("%s", p)
	return len(p), nil
}

func RequestLoggerMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		start := time.Now()
		err := next(c)
		duration := time.Since(start)

		log.Info().
			Str("method", c.Request().Method).
			Str("path", c.Path()).
			Int("status", c.Response().Status).
			Dur("latency", duration)

		return err
	}
}
