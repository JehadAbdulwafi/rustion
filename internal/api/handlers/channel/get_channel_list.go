package channel

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetChannelListRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Channel.GET("", getChannelListHandler(s))
}

func getChannelListHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		channels, err := s.Queries.GetChannels(ctx, user.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get channels")
		}

		var res types.ChannelList
		for _, channel := range channels {
			item := types.Channel{
				ID:       (*strfmt.UUID4)(swag.String(channel.ID.String())),
				UserID:   (*strfmt.UUID4)(swag.String(channel.ID.String())),
				Platform: swag.String(channel.Platform),
				Server:   swag.String(channel.Server),
				Secret:   swag.String(channel.Secret),
				Enabled:  swag.Bool(channel.Enabled),
				Label:    swag.String(channel.Label),
				Custom:   swag.Bool(channel.Custom),
			}

			res = append(res, &item)
		}

		if res == nil {
			res = types.ChannelList{}
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
