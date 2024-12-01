package auth

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PostRefreshRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.POST("/refresh", postRefreshHandler(s))
}

func postRefreshHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.PostRefreshPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		if body.RefreshToken == nil || *body.RefreshToken == "" {
			return echo.ErrUnauthorized
		}

		claims, err := util.VerifyJWT(*body.RefreshToken)
		if err != nil {
			return err
		}

		userId := claims["sub"]
		if userId == nil {
			return err
		}

		ID, err := uuid.Parse(userId.(string))
		if err != nil {
			return err
		}

		user, err := s.Queries.GetUserByID(c.Request().Context(), ID)
		if err != nil {
			return err
		}

		account, err := s.Queries.GetAccountByUserID(c.Request().Context(), user.ID)
		if err != nil {
			return echo.ErrNotFound
		}

		if !account.RefreshToken.Valid {
			return echo.ErrUnauthorized
		}

		if account.RefreshToken.String != *body.RefreshToken {
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
