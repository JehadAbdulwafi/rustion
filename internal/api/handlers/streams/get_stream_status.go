package streams

import (
	"fmt"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

func GetStreamStatusRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.GET("/ws", getStreamStatusHandler(s))
}

func getStreamStatusHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		websocket.Handler(func(ws *websocket.Conn) {
			defer ws.Close()
			for {
				// Write
				err := websocket.Message.Send(ws, "Hello, Client!")
				if err != nil {
					c.Logger().Error(err)
				}

				// Read
				msg := ""
				err = websocket.Message.Receive(ws, &msg)
				if err != nil {
					c.Logger().Error(err)
				}
				fmt.Printf("%s\n", msg)
			}
		}).ServeHTTP(c.Response(), c.Request())
		return nil
	}
}
