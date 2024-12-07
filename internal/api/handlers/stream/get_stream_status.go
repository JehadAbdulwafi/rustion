package stream

import (
	"context"
	"encoding/json"
	"sync"
	"time"

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

type ViewerInfo struct {
	ViewerID string    // User ID or device fingerprint
	JoinedAt time.Time
}

// StreamViewers stores active viewers for each stream
var streamViewers = struct {
	sync.RWMutex
	viewers map[uuid.UUID]map[string]ViewerInfo
}{viewers: make(map[uuid.UUID]map[string]ViewerInfo)}

// addViewer adds a viewer to the stream and returns true if the viewer was not already present
func addViewer(streamID uuid.UUID, viewerID string) bool {
	streamViewers.Lock()
	defer streamViewers.Unlock()

	if _, exists := streamViewers.viewers[streamID]; !exists {
		streamViewers.viewers[streamID] = make(map[string]ViewerInfo)
	}

	if _, exists := streamViewers.viewers[streamID][viewerID]; exists {
		return false
	}

	streamViewers.viewers[streamID][viewerID] = ViewerInfo{
		ViewerID: viewerID,
		JoinedAt: time.Now(),
	}
	return true
}

// removeViewer removes a viewer from the stream
func removeViewer(streamID uuid.UUID, viewerID string) bool {
	streamViewers.Lock()
	defer streamViewers.Unlock()

	if viewers, exists := streamViewers.viewers[streamID]; exists {
		if _, found := viewers[viewerID]; found {
			delete(viewers, viewerID)
			if len(viewers) == 0 {
				delete(streamViewers.viewers, streamID)
			}
			return true
		}
	}
	return false
}

func GetStreamStatusRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/:id/ws", getStreamStatusHandler(s))
}

func getStreamStatusHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		websocket.Handler(func(ws *websocket.Conn) {
			defer ws.Close()

			ctx := c.Request().Context()
			viewerID := c.QueryParam("viewer_id")
			if viewerID == "" {
				log.Error().Msg("No viewer ID provided")
				return
			}

			log.Info().Msg("new user joining stream")
			// Get stream ID from request
			id := c.Param("id")
			streamID, err := uuid.Parse(id)
			if err != nil {
				log.Error().Err(err).Msg("Error parsing stream ID: ")
				return
			}

			// Only increment if this is a new viewer
			if addViewer(streamID, viewerID) {
				err = s.Queries.IncrementStreamViewers(ctx, streamID)
				if err != nil {
					log.Error().Err(err).Msg("Error incrementing viewers in DB: ")
				}
			}

			// Decrement viewer count on disconnect if viewer exists
			defer func() {
				if removeViewer(streamID, viewerID) {
					log.Info().Msg("Attempting to decrement viewer count")
					err := s.Queries.DecrementStreamViewers(ctx, streamID)
					if err != nil {
						log.Error().Err(err).Msg("Error decrementing viewers in DB:")
					}
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
		log.Error().Err(err).Msg("Error fetching stream metadata: ")
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
		log.Error().Err(err).Msg("Error sending WebSocket message: ")
	}
}
