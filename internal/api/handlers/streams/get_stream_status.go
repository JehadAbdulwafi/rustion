package streams

import (
	"context"
	"encoding/json"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

type StreamMessage struct {
	StreamID uuid.UUID `json:"stream_id"`
}

type StreamStatus struct {
	StreamID     uuid.UUID `json:"stream_id"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	ViewersCount int32     `json:"viewers_count"`
	Status       string    `json:"status"`
	Viewers      int32     `json:"viewers"`
	Thumbnail    string    `json:"thumbnail"`
}

type WebSocketMessage struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

func (s *StreamStatus) Equals(other *StreamStatus) bool {
	return s.Title == other.Title &&
		s.Description == other.Description &&
		s.ViewersCount == other.ViewersCount
}

func GetStreamStatusRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.GET("/ws", getStreamStatusHandler(s))
}

func getStreamStatusHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		websocket.Handler(func(ws *websocket.Conn) {
			defer ws.Close()

			ctx := c.Request().Context()

			streamID := uuid.Nil
			var previousStreamStatus *StreamStatus

			for {
				msg := ""
				err := websocket.Message.Receive(ws, &msg)
				if err != nil {
					c.Logger().Error("Error receiving message: ", err)
					break
				}

				var streamMessage StreamMessage
				err = json.Unmarshal([]byte(msg), &streamMessage)
				if err != nil {
					c.Logger().Error(err)
					continue
				}

				streamID = streamMessage.StreamID

				err = s.Queries.IncrementStreamViewers(ctx, streamID)
				if err != nil {
					c.Logger().Error(err)
				}

				streamMetadata, err := s.Queries.GetStreamMetadata(ctx, streamID)
				if err != nil {
					c.Logger().Error(err)
					continue
				}

				currentStreamStatus := StreamStatus{
					StreamID:     streamMetadata.StreamID,
					Title:        streamMetadata.Title,
					Description:  streamMetadata.Description,
					ViewersCount: streamMetadata.Viewers.Int32,
					Status:       string(streamMetadata.Status),
					Viewers:      streamMetadata.Viewers.Int32,
					Thumbnail:    streamMetadata.Thumbnail.String,
				}

				if previousStreamStatus == nil || !previousStreamStatus.Equals(&currentStreamStatus) {
					statusMessage := WebSocketMessage{
						Type:    "status",
						Payload: currentStreamStatus,
					}
					jsonData, err := json.Marshal(statusMessage)
					if err != nil {
						c.Logger().Error("Error encoding JSON: ", err)
						continue
					}
					err = websocket.Message.Send(ws, string(jsonData))
					if err != nil {
						c.Logger().Error(err)
					}
					previousStreamStatus = &currentStreamStatus
				}
			}

			if streamID != uuid.Nil {
				err := s.Queries.DecrementStreamViewers(context.Background(), streamID)
				if err != nil {
					c.Logger().Error("Error decrementing viewer count: ", err)
				}
			}
		}).ServeHTTP(c.Response(), c.Request())
		return nil
	}
}
