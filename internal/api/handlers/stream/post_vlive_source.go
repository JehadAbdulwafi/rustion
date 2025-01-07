package stream

import (
	"encoding/json"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostVLiveSource(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.POST("/vlive/source", postVLiveSourceHandler(s))
}
func postVLiveSourceHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		// Retrieve the request body
		var requestBody map[string]interface{}
		if err := c.Bind(&requestBody); err != nil {
			return handleError(c, "Failed to parse request body", err)
		}

		log.Debug().Interface("requestBody", requestBody).Msg("Received request body")

		stream, err := s.Queries.GetStreamByUserId(ctx, user.ID)
		if err != nil {
			return handleError(c, "Failed to retrieve streams", err)
		}

		// Retrieve authentication token
		token, err := getAuthToken(s.Config.Auth.StreamApiSecret, stream.Host)
		if err != nil {
			return handleError(c, "Failed to retrieve auth token", err)
		}

		// Encode the request body as JSON
		jsonPayload, err := json.Marshal(requestBody)
		if err != nil {
			return handleError(c, "Failed to encode request body as JSON", err)
		}

		// Forward the request using the token
		responseData, err := forwardRequestWithBody(token, stream.Host, "terraform/v1/ffmpeg/vlive/source", jsonPayload)
		if err != nil {
			return handleError(c, "Failed to forward request", err)
		}

		// Respond to the client
		return c.JSON(http.StatusOK, responseData)
	}
}
