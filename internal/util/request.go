package util

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
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
