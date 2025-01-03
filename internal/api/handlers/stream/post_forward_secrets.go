package stream

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostForwardSecrets(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.POST("/forward/secrets", postForwardSecretsHandler(s))
}
func postForwardSecretsHandler(s *api.Server) echo.HandlerFunc {
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
		responseData, err := forwardRequestWithBody(token, stream.Host, "terraform/v1/ffmpeg/forward/secret", jsonPayload)
		if err != nil {
			return handleError(c, "Failed to forward request", err)
		}

		// Respond to the client
		return c.JSON(http.StatusOK, responseData)
	}
}

// forwardRequest forwards the request with the provided token
func forwardRequestWithBody(token string, host string, endpoint string, payload []byte) (map[string]interface{}, error) {
	forwardURL := fmt.Sprintf("https://%s/%s", host, endpoint)

	headers := http.Header{}
	headers.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	headers.Set("Content-Type", "application/json") // Set the content type for JSON

	response, err := util.SendRequest("POST", forwardURL, bytes.NewBuffer(payload), headers, nil)
	if err != nil {
		return nil, fmt.Errorf("error forwarding request: %w", err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading forward response: %w", err)
	}

	var responseData map[string]interface{}
	if err := json.Unmarshal(body, &responseData); err != nil {
		return nil, fmt.Errorf("error unmarshaling forward response: %w", err)
	}

	return responseData, nil
}
