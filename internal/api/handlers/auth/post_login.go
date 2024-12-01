package auth

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/JehadAbdulwafi/rustion/internal/util/hashing"
	"github.com/labstack/echo/v4"
)

func PostLoginRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.POST("/login", postLoginHandler(s))
}

func postLoginHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.PostLoginPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		user, err := s.Queries.GetUserByEmail(c.Request().Context(), body.Email.String())
		if err != nil {
			return echo.ErrNotFound
		}

		account, err := s.Queries.GetAccountByUserID(c.Request().Context(), user.ID)
		if err != nil {
			return echo.ErrNotFound
		}

		matches, err := hashing.ComparePasswordAndHash(*body.Password, user.Password)
		if err != nil {
			return echo.ErrUnauthorized
		}

		if !matches {
			return echo.ErrUnauthorized
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

		return c.JSON(http.StatusOK, types.PostLoginResponse{
			AccessToken:  &accessToken.String,
			RefreshToken: &refreshToken.String,
		})
	}
}
