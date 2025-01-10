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

func DeleteChannelRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Channel.DELETE("/:id", deleteChannelHandler(s))
}

func deleteChannelHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := channel.NewGetChannelRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}
		id := params.ID.String()

		_, err = s.Queries.GetChannel(ctx, database.GetChannelParams{
			ID:     uuid.MustParse(id),
			UserID: user.ID,
		})

		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "channel not found")
		}

		err = s.Queries.DeleteChannel(ctx, database.DeleteChannelParams{
			ID:     uuid.MustParse(id),
			UserID: user.ID,
		})

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete channel")
		}

		response := types.MessageResponse{
			Message: "Channel deleted successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
