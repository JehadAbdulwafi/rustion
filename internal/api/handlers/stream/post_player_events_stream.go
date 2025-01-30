package stream

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostPlayerEventsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.POST("/player-events", postPlayerEventsHandler(s))
}

type Stream struct {
	Vhost  string `json:"vhost,omitempty"`
	App    string `json:"app,omitempty"`
	Stream string `json:"stream,omitempty"`
	Param  string `json:"param,omitempty"`

	Server string `json:"server_id,omitempty"`
	Client string `json:"client_id,omitempty"`

	Update string `json:"update,omitempty"`
}

type Action string

const (
	ActionOnPublish        Action = "on_publish"
	ActionOnUnpublish             = "on_unpublish"
	ActionOnPlay                  = "on_play"
	ActionOnStop                  = "on_stop"
	ActionOnHls                   = "on_hls"
	SrsActionOnRecordBegin        = "on_record_begin"
	ActionOnRecordEnd             = "on_record_end"
	ActionOnOcr                   = "on_ocr"
)

func postPlayerEventsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		b, err := io.ReadAll(c.Request().Body)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest,
				fmt.Sprintf("Failed to read request body: %v", err))
		}

		log.Debug().RawJSON("raw_request", b).Msg("Received request")

		var request struct {
			Action Action `json:"action"`
			Stream
		}

		if err := json.Unmarshal(b, &request); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest,
				fmt.Sprintf("Invalid request format: %v", err))
		}

		action := request.Action
		stream := request.Stream

		log.Debug().
			Str("action", string(action)).
			Interface("stream", stream).
			Msg("Parsed request")

		// Return response
		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
