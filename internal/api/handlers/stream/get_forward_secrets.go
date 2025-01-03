package stream

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func GetForwardSecrets(s *api.Server) *echo.Route {
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
			return handleError(c, "Failed to retrieve streams", err)
		}

		// Retrieve authentication token
		token, err := getAuthToken(s.Config.Auth.StreamApiSecret, stream.Host)
		if err != nil {
			return handleError(c, "Failed to retrieve auth token", err)
		}

		// Forward the request using the token
		responseData, err := forwardRequest(token, stream.Host, "terraform/v1/ffmpeg/forward/secret")
		if err != nil {
			return handleError(c, "Failed to forward request", err)
		}

		// Respond to the client
		return c.JSON(http.StatusOK, responseData)
	}
}

// getAuthToken retrieves the authentication token
func getAuthToken(secret string, host string) (string, error) {
	endpoint := "terraform/v1/mgmt/login"
	authURL := fmt.Sprintf("https://%s/%s", host, endpoint)
	payload := util.GenericPayload{"password": secret}

	bodyReader, err := payload.Reader()
	if err != nil {
		return "", fmt.Errorf("error preparing payload: %w", err)
	}

	response, err := util.SendRequest("POST", authURL, bodyReader, nil, nil)
	if err != nil {
		return "", fmt.Errorf("error sending auth request: %w", err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return "", fmt.Errorf("error reading auth response: %w", err)
	}

	var loginResp LoginResponse
	if err := json.Unmarshal(body, &loginResp); err != nil {
		return "", fmt.Errorf("error unmarshaling auth response: %w", err)
	}

	return loginResp.Data.Bearer, nil
}

// forwardRequest forwards the request with the provided token
func forwardRequest(token string, host string, endpoint string) (map[string]interface{}, error) {
	forwardURL := fmt.Sprintf("https://%s/%s", host, endpoint)

	headers := http.Header{}
	headers.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	response, err := util.SendRequest("POST", forwardURL, nil, headers, nil)
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

// handleError logs the error and sends a JSON response to the client
func handleError(c echo.Context, message string, err error) error {
	fmt.Printf("%s: %v\n", message, err)
	return c.JSON(http.StatusInternalServerError, map[string]string{"error": message})
}
