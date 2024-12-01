package stream

import (
	"context"
	"encoding/json"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
	"golang.org/x/net/websocket"
)

type StreamStatus struct {
	StreamID    uuid.UUID `json:"stream_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	Viewers     int32     `json:"viewers"`
	Thumbnail   string    `json:"thumbnail"`
}

type WebSocketMessage struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

func GetStreamStatusRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/:id/ws", getStreamStatusHandler(s))
}

func getStreamStatusHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		websocket.Handler(func(ws *websocket.Conn) {
			defer ws.Close()

			ctx := c.Request().Context()

			log.Info().Msg("new user joining stream")
			// Get stream ID from request
			id := c.Param("id")
			streamID, err := uuid.Parse(id)
			if err != nil {
				log.Error().Err(err).Msg("Error parsing stream ID: ")
				return
			}

			// Increment viewer count
			err = s.Queries.IncrementStreamViewers(ctx, streamID)
			if err != nil {
				log.Error().Err(err).Msg("Error incrementing viewers in DB: ")
			}

			// Decrement viewer count on disconnect
			defer func() {
				log.Info().Msg("Attempting to decrement viewer count")
				err := s.Queries.DecrementStreamViewers(ctx, streamID)
				if err != nil {
					log.Error().Err(err).Msg("Error decrementing viewers in DB:")
				}
			}()

			// Send initial stream status
			sendStreamStatus(ws, s, ctx, streamID)

			// Keep connection alive and wait for disconnection
			for {
				var msg string
				err := websocket.Message.Receive(ws, &msg)
				if err != nil {
					// WebSocket is closed or error occurred
					log.Error().Err(err).Msg("WebSocket disconnected")
					break
				}
			}
		}).ServeHTTP(c.Response(), c.Request())
		return nil
	}
}
func sendStreamStatus(ws *websocket.Conn, s *api.Server, ctx context.Context, streamID uuid.UUID) {
	stream, err := s.Queries.GetStream(ctx, streamID)
	if err != nil {
		log.Error().Err(err).Msg("Error fetching stream metadata:")
		return
	}

	currentStreamStatus := StreamStatus{
		StreamID:    stream.ID,
		Title:       stream.LiveTitle.String,
		Description: stream.LiveDescription.String,
		Status:      string(stream.Status),
		Viewers:     stream.Viewers.Int32,
		Thumbnail:   stream.Thumbnail.String,
	}

	statusMessage := WebSocketMessage{
		Type:    "status",
		Payload: currentStreamStatus,
	}

	jsonData, err := json.Marshal(statusMessage)
	if err != nil {
		log.Error().Err(err).Msg("Error encoding JSON: ")
		return
	}

	err = websocket.Message.Send(ws, string(jsonData))
	if err != nil {
		log.Error().Err(err).Msg("Error sending WebSocket message:")
	}
}
