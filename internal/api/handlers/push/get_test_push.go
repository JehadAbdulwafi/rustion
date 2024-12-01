package push

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetPushTestRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Push.GET("/test", getPushTestHandler(s))
}

func getPushTestHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		log := util.LogFromContext(ctx)

		fingerprint := c.QueryParam("fingerprint")

		err := s.Push.SendToUsers(ctx, uuid.New(), "Hello", "World", "")
		if err != nil {
			log.Debug().Err(err).Str("fingerprint", fingerprint).Msg("Error while sending push to user.")
			return err
		}

		log.Debug().Str("fingerprint", fingerprint).Msg("Successfully sent push message.")

		return c.String(http.StatusOK, "Success")
	}
}
