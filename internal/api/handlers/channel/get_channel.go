package channel

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/channel"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetChannelRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Channel.GET("/:id", getChannelHandler(s))
}

func getChannelHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := channel.NewGetChannelRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}

		channelID := uuid.MustParse(params.ID.String())

		channel, err := s.Queries.GetChannel(ctx, database.GetChannelParams{
			ID:     channelID,
			UserID: user.ID,
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "channel not found")
		}

		// TODO: Implement

		response := types.Channel{
			ID:       (*strfmt.UUID4)(swag.String(channel.ID.String())),
			UserID:   (*strfmt.UUID4)(swag.String(channel.ID.String())),
			Platform: swag.String(channel.Platform),
			Server:   swag.String(channel.Server),
			Secret:   swag.String(channel.Secret),
			Enabled:  swag.Bool(channel.Enabled),
			Custom:   swag.Bool(channel.Custom),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
