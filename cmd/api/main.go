package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/router"
	"github.com/JehadAbdulwafi/rustion/internal/config"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	config := config.DefaultServiceConfigFromEnv()

	zerolog.TimeFieldFormat = time.RFC3339Nano
	zerolog.SetGlobalLevel(config.Logger.Level)
	if config.Logger.PrettyPrintConsole {
		log.Logger = log.Output(zerolog.NewConsoleWriter(func(w *zerolog.ConsoleWriter) {
			w.TimeFormat = "15:04:05"
		}))
	}

	s := api.NewServer(config)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	if err := s.InitDB(ctx); err != nil {
		cancel()
		log.Fatal().Err(err).Msg("Failed to initialize database")
	}
	cancel()

	router.Init(s)

	go func() {
		if err := s.Start(); err != nil {
			if errors.Is(err, http.ErrServerClosed) {
				log.Info().Msg("Server closed")
			} else {
				log.Fatal().Err(err).Msg("Failed to start server")
			}
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	ctx, cancel = context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := s.Shutdown(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal().Err(err).Msg("Failed to gracefully shut down server")
	}
}