package util

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/labstack/echo/v4"
)

type GenericPayload map[string]interface{}
type GenericArrayPayload []interface{}

func (g GenericPayload) Reader() (*bytes.Reader, error) {
	b, err := json.Marshal(g)
	if err != nil {
		return nil, fmt.Errorf("failed to serialize payload: %v", err)
	}
	return bytes.NewReader(b), nil
}

func (g GenericArrayPayload) Reader() (*bytes.Reader, error) {
	b, err := json.Marshal(g)
	if err != nil {
		return nil, fmt.Errorf("failed to serialize payload: %v", err)
	}
	return bytes.NewReader(b), nil
}

func SendRequest(method, path string, body io.Reader, headers http.Header, queryParams map[string]string) (*http.Response, error) {
	client := &http.Client{}

	// Build the URL with query parameters
	reqURL, err := url.Parse(path)
	if err != nil {
		return nil, fmt.Errorf("failed to parse URL: %v", err)
	}

	if queryParams != nil {
		q := reqURL.Query()
		for k, v := range queryParams {
			q.Set(k, v)
		}
		reqURL.RawQuery = q.Encode()
	}

	// Create the request
	req, err := http.NewRequest(method, reqURL.String(), body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	for key, values := range headers {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}
	if body != nil && req.Header.Get("Content-Type") == "" {
		req.Header.Set("Content-Type", "application/json")
	}

	// Send the request
	return client.Do(req)
}

type LoginResponse struct {
	Data struct {
		Token  string `json:"token"`
		Bearer string `json:"bearer"`
	} `json:"data"`
}

// getAuthToken retrieves the authentication token
func GetAuthToken(secret string, host string) (string, error) {
	endpoint := "terraform/v1/mgmt/login"
	authURL := fmt.Sprintf("https://%s/%s", host, endpoint)
	payload := GenericPayload{"password": secret}

	bodyReader, err := payload.Reader()
	if err != nil {
		return "", fmt.Errorf("error preparing payload: %w", err)
	}

	response, err := SendRequest("POST", authURL, bodyReader, nil, nil)
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

// Request forwards the request with the provided token
func Request(token string, host string, endpoint string) (map[string]interface{}, error) {
	forwardURL := fmt.Sprintf("https://%s/%s", host, endpoint)

	headers := http.Header{}
	headers.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	response, err := SendRequest("POST", forwardURL, nil, headers, nil)
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
func HandleError(c echo.Context, message string, err error) error {
	fmt.Printf("%s: %v\n", message, err)
	return c.JSON(http.StatusInternalServerError, map[string]string{"error": message})
}

// RequestWithBody forwards the request with the provided token
func RequestWithBody(token string, host string, endpoint string, payload []byte) (map[string]interface{}, error) {
	forwardURL := fmt.Sprintf("https://%s/%s", host, endpoint)

	headers := http.Header{}
	headers.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	headers.Set("Content-Type", "application/json") // Set the content type for JSON

	response, err := SendRequest("POST", forwardURL, bytes.NewBuffer(payload), headers, nil)
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
