package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func GetForwardSecretsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/forward/secrets", getForwardSecretsHandler(s))
}

type LoginResponse struct {
	Data struct {
		Token  string `json:"token"`
		Bearer string `json:"bearer"`
	} `json:"data"`
}

func getForwardSecretsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		stream, err := s.Queries.GetStreamByUserId(ctx, user.ID)
		if err != nil {
			return util.HandleError(c, "Failed to retrieve streams", err)
		}

		// Retrieve authentication token
		token, err := util.GetAuthToken(s.Config.Auth.StreamApiSecret, stream.Host)
		if err != nil {
			return util.HandleError(c, "Failed to retrieve auth token", err)
		}

		// Forward the request using the token
		responseData, err := util.Request(token, stream.Host, "terraform/v1/ffmpeg/forward/secret")
		if err != nil {
			return util.HandleError(c, "Failed to forward request", err)
		}

		// Respond to the client
		return c.JSON(http.StatusOK, responseData)
	}
}
