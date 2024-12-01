package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types/stream"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.DELETE("/:id", deleteStreamHandler(s))
}

func deleteStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := stream.NewGetStreamRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return echo.ErrBadRequest
		}
		id := params.ID.String()
		streamID, err := uuid.Parse(id)
		if err != nil {
			return echo.ErrBadRequest
		}

		stream, err := s.Queries.GetStream(ctx, streamID)
		if err != nil {
			return echo.ErrNotFound
		}

		if stream.UserID != user.ID {
			return echo.ErrUnauthorized
		}

		err = s.Queries.DeleteStream(ctx, streamID)
		if err != nil {
			return echo.ErrInternalServerError
		}

		return c.NoContent(http.StatusNoContent)
	}
}
