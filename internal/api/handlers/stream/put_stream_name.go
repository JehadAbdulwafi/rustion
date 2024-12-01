package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/stream"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PutStreamNameRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.PUT("/:id/name", putStreamNameHandler(s))
}

func putStreamNameHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := stream.NewGetStreamRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}
		id := params.ID.String()

		var body types.UpdateStreamNamePayload
		err = util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}

		streamID, err := uuid.Parse(id)
		if err != nil {
			return echo.ErrBadRequest
		}

		stream, err := s.Queries.GetStreamById(ctx, streamID)
		if err != nil {
			return echo.ErrNotFound
		}

		if stream.UserID != user.ID {
			return echo.ErrUnauthorized
		}

		err = s.Queries.UpdateStreamName(ctx, database.UpdateStreamNameParams{
			ID:   stream.ID,
			Name: *body.Name,
		})

		if err != nil {
			return echo.ErrInternalServerError
		}

		return c.JSON(http.StatusOK, "ok")
	}
}
