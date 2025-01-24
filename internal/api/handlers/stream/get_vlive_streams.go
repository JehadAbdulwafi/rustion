package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/labstack/echo/v4"
)

func GetVLiveStreamsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/vlive/streams", getVLiveStreamsHandler(s))
}

func getVLiveStreamsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		stream, err := s.Queries.GetStreamByUserId(ctx, user.ID)
		if err != nil {
			return handleError(c, "Failed to retrieve streams", err)
		}

		// Retrieve authentication token
		token, err := getAuthToken(s.Config.Auth.StreamApiSecret, stream.Host)
		if err != nil {
			return handleError(c, "Failed to retrieve auth token", err)
		}

		// Forward the request using the token
		responseData, err := forwardRequest(token, stream.Host, "terraform/v1/ffmpeg/vlive/streams")
		if err != nil {
			return handleError(c, "Failed to forward request", err)
		}

		// Respond to the client
		return c.JSON(http.StatusOK, responseData)
	}
}
