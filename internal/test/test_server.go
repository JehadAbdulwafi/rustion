package test

import (
	"context"
	"database/sql"
	"testing"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/router"
	"github.com/JehadAbdulwafi/rustion/internal/config"
	"github.com/JehadAbdulwafi/rustion/internal/database"
)

// WithTestServer returns a fully configured server (using the default server config).
func WithTestServer(t *testing.T, closure func(s *api.Server)) {
	t.Helper()
	defaultConfig := config.DefaultServiceConfigFromEnv()
	WithTestServerConfigurable(t, defaultConfig, closure)
}

// WithTestServerConfigurable returns a fully configured server, allowing for configuration using the provided server config.
func WithTestServerConfigurable(t *testing.T, config config.Server, closure func(s *api.Server)) {
	t.Helper()
	ctx := context.Background()
	WithTestServerConfigurableContext(ctx, t, config, closure)
}

// WithTestServerConfigurableContext returns a fully configured server, allowing for configuration using the provided server config.
// The provided context will be used during setup (instead of the default background context).
func WithTestServerConfigurableContext(ctx context.Context, t *testing.T, config config.Server, closure func(s *api.Server)) {
	t.Helper()
	WithTestDatabaseContext(ctx, config, t, func(db *sql.DB) {
		t.Helper()
		execClosureNewTestServer(ctx, t, config, db, closure)
	})
}

// Executes closure on a new test server with a pre-provided database
func execClosureNewTestServer(ctx context.Context, t *testing.T, config config.Server, db *sql.DB, closure func(s *api.Server)) {
	t.Helper()

	// https://stackoverflow.com/questions/43424787/how-to-use-next-available-port-in-http-listenandserve
	// You may use port 0 to indicate you're not specifying an exact port but you want a free, available port selected by the system
	config.Echo.ListenAddress = ":0"

	s := api.NewServer(config)

	// attach the already initialized db

	queries := database.New(db)
	s.DB = db
	s.Queries = queries

	router.Init(s)


	closure(s)

	// echo is managed and should close automatically after running the test
	if err := s.Echo.Shutdown(ctx); err != nil {
		t.Fatalf("failed to shutdown server: %v", err)
	}

	// disallow any further refs to managed object after running the test
	s = nil
}
