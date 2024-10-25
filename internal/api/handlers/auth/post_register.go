package auth

import (
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/httperrors"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/JehadAbdulwafi/rustion/internal/util/hashing"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostRegisterRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.POST("/register", postRegisterHandler(s))
}

func postRegisterHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.PostRegisterPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		exists, err := s.Queries.CheckUserExists(c.Request().Context(), body.Email.String())
		if err != nil {
			return err
		}

		if exists {
			return echo.NewHTTPError(http.StatusConflict, "User already exists")
		}

		hash, err := hashing.HashPassword(*body.Password, hashing.DefaultArgon2Params)
		if err != nil {
			log.Debug().Str("email", body.Email.String()).Err(err).Msg("Failed to hash user password")
			return httperrors.ErrBadRequestInvalidPassword
		}

		response := &types.PostLoginResponse{}

		user, err := s.Queries.CreateUser(c.Request().Context(), database.CreateUserParams{
			Name:     *body.Name,
			Email:    body.Email.String(),
			Password: hash,
		})

		if err != nil {
			log.Debug().Err(err).Msg("Failed to insert user")
			return err
		}

		accessToken, err := util.GenerateJwt(user.Email, s.Config.Auth.AccessTokenValidity)

		if err != nil {
			log.Debug().Err(err).Msg("Failed to generate access token")
			return err
		}

		response.AccessToken = &accessToken.String

		refreshToken, err := util.GenerateJwt(user.Email, s.Config.Auth.RefreshTokenValidity)

		if err != nil {
			log.Debug().Err(err).Msg("Failed to generate refresh token")
			return err
		}

		response.RefreshToken = &refreshToken.String

		_, err = s.Queries.CreateAccount(c.Request().Context(), database.CreateAccountParams{
			UserID:            user.ID,
			Provider:          "rustion",
			ProviderAccountID: user.ID.String(),
			AccessToken:       accessToken,
			RefreshToken:      refreshToken,
			ValidUntil:        time.Now().Add(s.Config.Auth.AccessTokenValidity),
		})

		if err != nil {
			log.Debug().Err(err).Msg("Failed to insert account")
			return err
		}

		return c.JSON(http.StatusOK, response)
	}
}
