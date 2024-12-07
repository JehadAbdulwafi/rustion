package auth

import (
	"database/sql"
	"errors"
	"net/http"
	"net/url"
	"path"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	// "github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PostForgotPasswordRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.POST("/forgot-password", postForgotPasswordHandler(s))
}

func postForgotPasswordHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		var body types.PostForgotPasswordPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		log := util.LogFromContext(ctx).With().Str("email", body.Email.String()).Logger()

		user, err := s.Queries.GetUserByEmail(ctx, body.Email.String())
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				log.Debug().Str("email", body.Email.String()).Err(err).Msg("User not found")
				return c.NoContent(http.StatusNoContent)
			}

			log.Debug().Str("email", body.Email.String()).Err(err).Msg("Failed to load user")
			return err
		}

		// if s.Config.Auth.PasswordResetTokenDebounceDuration > 0 {
		// 	resetTokenInDebounceTimeExists, err := s.Queries.GetUserResetPasswordToken(ctx, database.GetUserResetPasswordTokenParams{
		// 		UserID:    user.ID,
		// 		CreatedAt: time.Now().Add(-s.Config.Auth.PasswordResetTokenReuseDuration),
		// 	})
		// 	if err != nil {
		// 		log.Error().Err(err).Msg("Failed to check for existing password reset token")
		// 		return err
		// 	}
		//
		// 	if resetTokenInDebounceTimeExists.Token != uuid.Nil {
		// 		log.Debug().Msg("Password reset token exists within debounce time, not sending new one")
		// 		return c.NoContent(http.StatusNoContent)
		// 	}
		// }

		if err := util.WithTransaction(ctx, s.DB, func(tx *sql.Tx) error {
			passwordResetToken, err := s.Queries.GetResetPasswordTokenByUser(ctx, user.ID)

			if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
					log.Debug().Err(err).Msg("No valid password reset token exists, creating new one")

					_, err := s.Queries.CreateResetPasswordToken(ctx, database.CreateResetPasswordTokenParams{
						UserID:     user.ID,
						ValidUntil: time.Now().Add(s.Config.Auth.PasswordResetTokenValidity),
					})

					if err != nil {
						log.Debug().Err(err).Msg("Failed to insert password reset token")
						return err
					}
				} else {
					log.Debug().Err(err).Msg("Failed to check for existing valid password reset token")
					return err
				}
			}

			u, err := url.Parse(s.Config.Frontend.BaseURL)
			if err != nil {
				log.Error().Err(err).Msg("Failed to parse frontend base URL")
				return err
			}


			passwordResetToken, err = s.Queries.GetResetPasswordTokenByUser(ctx, user.ID)
			if err != nil {
				log.Error().Err(err).Msg("Failed to parse frontend base URL")
				return err
			}

			u.Path = path.Join(u.Path, s.Config.Frontend.PasswordResetEndpoint)

			q := u.Query()
			q.Set("token", passwordResetToken.Token.String())
			u.RawQuery = q.Encode()

			if err := s.Mailer.SendPasswordReset(ctx, user.Email, u.String()); err != nil {
				log.Debug().Err(err).Msg("Failed to send password reset email")
				return err
			}

			return nil
		}); err != nil {
			log.Debug().Err(err).Msg("Failed to initiate password reset")
			return err
		}

		log.Debug().Msg("Successfully initiated password reset")

		return c.NoContent(http.StatusNoContent)
	}
}
