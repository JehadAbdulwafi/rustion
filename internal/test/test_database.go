package test

import (
	"context"
	"database/sql"
	"fmt"
	"testing"

	"github.com/JehadAbdulwafi/rustion/internal/config"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/util"
)

var (
	FixturesApplied = true
)

// WithTestDatabaseContext returns an isolated test database based on the current migrations and fixtures.
// The provided context will be used during setup (instead of the default background context).
func WithTestDatabaseContext(ctx context.Context, config config.Server, t *testing.T, closure func(db *sql.DB)) {
	t.Helper()
	execClosureTestDatabase(ctx, config, t, closure)
}

// Executes closure on an integresql **test** database (scaffolded from a template)
func execClosureTestDatabase(ctx context.Context, config config.Server, t *testing.T, closure func(db *sql.DB)) {
	t.Helper()

	connectionString := config.Database.TestConnectionString()
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		t.Fatalf("Failed to setup test database for connectionString %q: %v", connectionString, err)
	}

	if err := db.PingContext(ctx); err != nil {
		t.Fatalf("Failed to ping test database for connectionString %q: %v", connectionString, err)
	}

	// run fixtures

	if !FixturesApplied {
		countFixtures, err := ApplyTestFixtures(ctx, t, db)
		if err != nil {
			t.Fatalf("Failed to apply test fixtures: %v", err)
		}

		t.Logf("Applied %d fixtures", countFixtures)

	}

	closure(db)

	// this database object is managed and should close automatically after running the test
	if err := db.Close(); err != nil {
		t.Fatalf("Failed to close db %q: %v", connectionString, err)
	}

	// disallow any further refs to managed object after running the test
	db = nil
}

// ApplyTestFixtures applies all current test fixtures (insert) to db
func ApplyTestFixtures(ctx context.Context, t *testing.T, db *sql.DB) (countFixtures int, err error) {
	t.Helper()

	inserts := Inserts()
	// insert test fixtures in an auto-managed db transaction
	err = util.WithTransaction(ctx, db, func(tx *sql.Tx) error {
		t.Helper()
		for _, fixture := range inserts {
			switch v := fixture.(type) {
			case *database.User:
				if _, err := db.Exec("INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)", v.ID, v.Name, v.Email, v.Password); err != nil {
					return fmt.Errorf("failed to insert user fixture: %w", err)
				}
			case *database.Account:
				if _, err := db.Exec(`INSERT INTO accounts 
				(user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
				`, v.UserID, v.Provider, v.ProviderAccountID, v.RefreshToken, v.AccessToken, v.ValidUntil, v.Scope, v.TokenType); err != nil {
					return fmt.Errorf("failed to insert account fixture: %w", err)
				}
			}
		}
		return nil
	})

	if err != nil {
		return 0, err
	}

	return len(inserts), nil
}
