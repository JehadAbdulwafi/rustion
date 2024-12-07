package auth

import (
	"database/sql"
	"errors"
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/httperrors"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/JehadAbdulwafi/rustion/internal/util/hashing"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PostForgotPasswordCompleteRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.POST("/forgot-password/complete", postForgotPasswordCompleteHandler(s))
}

func postForgotPasswordCompleteHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		log := util.LogFromContext(ctx)

		var body types.PostForgotPasswordCompletePayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		Token, err := uuid.Parse(string(*body.Token))

		if err != nil {
			return err
		}

		passwordResetToken, err := s.Queries.GetResetPasswordToken(ctx, Token)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				log.Debug().Err(err).Msg("Password reset token not found")
				return httperrors.ErrNotFoundTokenNotFound
			}

			log.Debug().Msg("Failed to load password reset token")
			return err
		}

		user, err := s.Queries.GetUserByID(ctx, passwordResetToken.UserID)
		if err != nil {
			return err
		}

		if time.Now().After(passwordResetToken.ValidUntil) {
			log.Debug().
				Str("user_id", user.ID.String()).
				Time("valid_until", passwordResetToken.ValidUntil).
				Msg("Password reset token is no longer valid, rejecting password reset")
			return httperrors.ErrConflictTokenExpired
		}

		hash, err := hashing.HashPassword(*body.Password, hashing.DefaultArgon2Params)
		if err != nil {
			log.Debug().Str("user_id", user.ID.String()).Err(err).Msg("Failed to hash new password")
			return httperrors.ErrBadRequestInvalidPassword
		}

		response := &types.PostLoginResponse{}

		if err := util.WithTransaction(ctx, s.DB, func(tx *sql.Tx) error {

			if _, err := s.Queries.UpdateUserPassword(ctx, database.UpdateUserPasswordParams{
				ID:       user.ID,
				Password: hash,
			}); err != nil {
				log.Debug().Str("user_id", user.ID.String()).Err(err).Msg("Failed to update user")
				return err
			}

			account, err := s.Queries.GetAccountByUserID(c.Request().Context(), user.ID)
			if err != nil {
				return echo.ErrNotFound
			}

			accessToken, err := util.GenerateJwt(user.ID.String(), s.Config.Auth.AccessTokenValidity)
			if err != nil {
				return err
			}

			refreshToken, err := util.GenerateJwt(user.ID.String(), s.Config.Auth.RefreshTokenValidity)
			if err != nil {
				return err
			}

			_, err = s.Queries.UpdateAccountTokens(c.Request().Context(), database.UpdateAccountTokensParams{
				RefreshToken: sql.NullString{
					String: refreshToken.String,
					Valid:  true,
				},
				AccessToken:       sql.NullString{String: accessToken.String, Valid: true},
				ValidUntil:        time.Now().Add(s.Config.Auth.AccessTokenValidity),
				UserID:            user.ID,
				ProviderAccountID: account.ProviderAccountID,
			})

			if err != nil {
				return err
			}

			if err := s.Queries.DeleteResetPasswordToken(ctx, Token); err != nil {
				log.Debug().Str("user_id", user.ID.String()).Err(err).Msg("Failed to delete password reset token")
				return err
			}

			response.AccessToken = &accessToken.String
			response.RefreshToken = &refreshToken.String

			return nil
		}); err != nil {
			log.Debug().Str("user_id", user.ID.String()).Err(err).Msg("Failed to complete password reset")
			return err
		}

		log.Debug().Str("user_id", user.ID.String()).Msg("Successfully completed password reset, returning new set of access and refresh tokens")

		return util.ValidateAndReturn(c, http.StatusOK, response)
	}
}
