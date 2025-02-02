package seed

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/JehadAbdulwafi/rustion/internal/config"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/test"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/rs/zerolog/log"
)

func InsertSeedData() error {
	fmt.Println("Seeding data into the database...")
	ctx := context.Background()

	defaultConfig := config.DefaultServiceConfigFromEnv()

	db, err := sql.Open("postgres", defaultConfig.Database.ConnectionString())
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to initialize database")
	}

	if err := db.PingContext(ctx); err != nil {
		log.Fatal().Err(err).Msg("Failed to ping database")
	}

	inserts := test.Inserts()

	err = util.WithTransaction(ctx, db, func(tx *sql.Tx) error {

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

			case *database.Stream:
				if _, err := db.Exec(`INSERT INTO streams
				(id, user_id, app, name, url, password, endpoint, host, status, live_title, live_description, thumbnail, last_published_at, viewers)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
				`, v.ID, v.UserID, v.App, v.Name, v.Url, v.Password, v.Endpoint, v.Host, v.Status, v.LiveTitle.String, v.LiveDescription.String, v.Thumbnail.String, v.LastPublishedAt.Time, v.Viewers.Int32); err != nil {
					return fmt.Errorf("failed to insert stream fixture: %w", err)
				}
			case *database.App:
				if _, err := db.Exec(`INSERT INTO apps
				(id, user_id, name)
				VALUES ($1, $2, $3)
				`, v.ID, v.UserID, v.Name); err != nil {
					return fmt.Errorf("failed to insert app fixture: %w", err)
				}
			case *database.Tag:
				if _, err := db.Exec(`INSERT INTO tags
					(id, title, app_id) VALUES ($1, $2, $3)`,
					v.ID, v.Title, v.AppID); err != nil {
					return fmt.Errorf("failed to insert tags fixture: %w", err)
				}
			case *database.FeaturedSection:
				if _, err := db.Exec(`INSERT INTO featured_sections
					(id, title, app_id) VALUES ($1, $2, $3)`,
					v.ID, v.Title, v.AppID); err != nil {
					return fmt.Errorf("failed to insert featured_sections fixture: %w", err)
				}
			case *database.Article:
				if _, err := db.Exec(`INSERT INTO articles
					(id, title, content, image, tags, description, app_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
					v.ID, v.Title, v.Content, v.Image, v.Tags, v.Description.String, v.AppID); err != nil {
					return fmt.Errorf("failed to insert articles fixture: %w", err)
				}
			case *database.FeaturedArticle:
				if _, err := db.Exec(`INSERT INTO featured_articles 
					(id, article_id, featured_section_id) VALUES ($1, $2, $3)`,
					v.ID, v.ArticleID, v.FeaturedSectionID); err != nil {
					return fmt.Errorf("failed to insert featured_articles fixture: %w", err)
				}
			case *database.TvShow:
				if _, err := db.Exec(`INSERT INTO tv_shows
				(id, title, genre, description, image, app_id)
				VALUES ($1, $2, $3, $4, $5, $6)
				`, v.ID, v.Title, v.Genre, v.Description.String, v.Image.String, v.AppID); err != nil {
					return fmt.Errorf("failed to insert tv_show fixture: %w", err)
				}
			}
		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}
