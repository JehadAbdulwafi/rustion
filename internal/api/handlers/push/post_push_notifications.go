package push

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostPushNotificationsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Push.POST("/notifications", postPushNotificationsHandler(s))
}

func postPushNotificationsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		log := util.LogFromContext(ctx)
		user := auth.UserFromContext(ctx)

		var body types.SendPushNotificationPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		err = s.Push.SendToUsers(ctx, userApp.ID, *body.Subject, *body.Body, body.Image)
		if err != nil {
			log.Debug().Err(err).Str("fingerprint", userApp.ID.String()).Msg("Error while sending push to users.")
			return err
		}

		log.Debug().Str("fingerprint", userApp.ID.String()).Msg("Successfully sent push message.")

		return c.String(http.StatusOK, "Success")
	}
}
