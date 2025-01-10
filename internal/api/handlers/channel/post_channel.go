package channel

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostChannelRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Channel.POST("", postChannelHandler(s))
}

func postChannelHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		var body types.ChannelPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}

		// check if the platform is allowed
		allowedPlatforms := []string{"youtube", "twitch", "facebook", "instagram", "tiktok"}
		if !util.ContainsString(allowedPlatforms, *body.Platform) {
			return echo.NewHTTPError(http.StatusBadRequest, "platform not allowed")
		}

		channels, err := s.Queries.GetChannels(ctx, user.ID)
		if err != nil {
			return err
		}

		// check the limit
		if len(channels) >= 5 {
			return echo.NewHTTPError(http.StatusForbidden, "maximum number of channels reached")
		}

		// check if the platform is exist in the user channels
		for _, channel := range channels {
			if channel.Platform == *body.Platform {
				return echo.NewHTTPError(http.StatusForbidden, "platform already exist")
			}
		}

		// create the channel
		err = s.Queries.CreateChannel(ctx, database.CreateChannelParams{
			UserID:   user.ID,
			Platform: *body.Platform,
			Server:   *body.Server,
			Secret:   *body.Secret,
			Enabled:  *body.Enabled,
			Custom:   *body.Custom,
		})
		if err != nil {
			return err
		}

		response := types.MessageResponse{
			Message: "Channel created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
