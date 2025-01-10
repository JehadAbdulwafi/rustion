package channel

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/channel"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PutChannelRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Channel.PUT("/:id", putChannelHandler(s))
}

func putChannelHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := channel.NewGetChannelRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}
		id := params.ID.String()

		var body types.ChannelPayload
		err = util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}

		_, err = s.Queries.GetChannel(ctx, database.GetChannelParams{
			ID:     uuid.MustParse(id),
			UserID: user.ID,
		})

		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "channel not found")
		}

		err = s.Queries.UpdateChannel(ctx, database.UpdateChannelParams{
			ID:       uuid.MustParse(id),
			UserID:   user.ID,
			Platform: *body.Platform,
			Server:   *body.Server,
			Secret:   *body.Secret,
			Enabled:  *body.Enabled,
			Custom:   *body.Custom,
		})

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update channel")
		}

		response := types.MessageResponse{
			Message: "Channel updated successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
