package streams_test

import (
	"net/http"
	"testing"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/test"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPostStopStream(t *testing.T) {
	test.WithTestServer(t, func(s *api.Server) {
		fixtures := test.Fixtures()

		reqBody := test.GenericPayload{
			"app":        "live",
			"stream":     fixtures.Stream1.StreamName,
			"vhost":      "localhost",
			"action":     util.StreamActionStop,
			"client_id":  "1234567890",
			"server_id":  "1234567890",
			"ip":         "192.168.1.6",
			"stream_id":  fixtures.Stream1.ID,
			"stream_url": fixtures.Stream1.Url,
			"param":      "",
		}

		res := test.PerformRequest(t, s, "POST", "/api/v1/streams/stop", reqBody, nil)
		require.Equal(t, http.StatusOK, res.Result().StatusCode)

		var response types.StreamEventResponse
		test.ParseResponseAndValidate(t, res, &response)

		// Fix for UUID comparison
		code := int64(0)
		assert.Equal(t, &code, response.Code)
	})
}

func TestPostStopStreamOffline(t *testing.T) {
	test.WithTestServer(t, func(s *api.Server) {
		fixtures := test.Fixtures()

		reqBody := test.GenericPayload{
			"app":        "live",
			"stream":     fixtures.Stream2.StreamName,
			"vhost":      "localhost",
			"action":     util.StreamActionStop,
			"client_id":  "1234567890",
			"server_id":  "1234567890",
			"ip":         "192.168.1.6",
			"stream_id":  fixtures.Stream2.ID,
			"stream_url": fixtures.Stream2.Url,
			"param":      "",
		}

		res := test.PerformRequest(t, s, "POST", "/api/v1/streams/stop", reqBody, nil)
		require.Equal(t, http.StatusForbidden, res.Result().StatusCode)
	})
}

func TestPostStopStreamPlayAction(t *testing.T) {
	test.WithTestServer(t, func(s *api.Server) {
		fixtures := test.Fixtures()

		reqBody := test.GenericPayload{
			"app":        "live",
			"stream":     fixtures.Stream2.StreamName,
			"vhost":      "localhost",
			"action":     util.StreamActionPlay,
			"client_id":  "1234567890",
			"server_id":  "1234567890",
			"ip":         "192.168.1.6",
			"stream_id":  fixtures.Stream2.ID,
			"stream_url": fixtures.Stream2.Url,
			"param":      "",
		}

		res := test.PerformRequest(t, s, "POST", "/api/v1/streams/stop", reqBody, nil)
		require.Equal(t, http.StatusBadRequest, res.Result().StatusCode)
	})
}

