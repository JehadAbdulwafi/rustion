package auth

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/api/httperrors"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/JehadAbdulwafi/rustion/internal/util/hashing"
	"github.com/labstack/echo/v4"
)

func PostChangePasswordRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.POST("/change-password", postChangePasswordHandler(s))
}

func postChangePasswordHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		log := util.LogFromContext(ctx)

		var body types.PostChangePasswordPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		user := auth.UserFromEchoContext(c)

		match, err := hashing.ComparePasswordAndHash(*body.CurrentPassword, user.Password)
		if err != nil {
			log.Debug().Err(err).Msg("Failed to compare password with stored hash")
			return err
		}

		if !match {
			log.Debug().Msg("Provided password does not match stored hash")
			return echo.ErrUnauthorized
		}

		hash, err := hashing.HashPassword(*body.NewPassword, hashing.DefaultArgon2Params)
		if err != nil {
			log.Debug().Err(err).Msg("Failed to hash new password")
			return httperrors.ErrBadRequestInvalidPassword
		}

		response := &types.PostLoginResponse{}

		if err := util.WithTransaction(ctx, s.DB, func(tx *sql.Tx) error {

			if _, err := s.Queries.UpdateUserPassword(ctx, database.UpdateUserPasswordParams{
				Password: hash,
				ID:       user.ID,
			}); err != nil {
				log.Debug().Err(err).Msg("Failed to update user")
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

			response.AccessToken = &accessToken.String
			response.RefreshToken = &refreshToken.String

			return nil
		}); err != nil {
			log.Debug().Err(err).Msg("Failed to change password")
			return err
		}

		log.Debug().Msg("Successfully changed password, returning new set of access and refresh tokens")

		return util.ValidateAndReturn(c, http.StatusOK, response)
	}
}
