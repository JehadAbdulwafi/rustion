package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types/stream"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetResetStreamPasswordRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/:id/reset-password", getResetStreamPasswordHandler(s))
}

func getResetStreamPasswordHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		log := util.LogFromContext(ctx)

		params := stream.NewGetStreamRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}
		id := params.ID.String()

		streamID, err := uuid.Parse(id)
		if err != nil {
			return echo.ErrBadRequest
		}

		stream, err := s.Queries.GetStreamById(ctx, streamID)
		if err != nil {
			log.Error().Err(err).Msg("Error getting stream by ID")
			return echo.ErrNotFound
		}

		if stream.UserID != user.ID {
			return echo.ErrUnauthorized
		}

		
		randomPassword, err := util.GenerateRandomString(
			10,
			[]util.CharRange{util.CharRangeAlphaLowerCase, util.CharRangeAlphaUpperCase, util.CharRangeNumeric},
			"",
		)

		if err != nil {
			return echo.ErrInternalServerError
		}

		err = s.Queries.UpdateStreamPassword(ctx, database.UpdateStreamPasswordParams{
			ID:   stream.ID,
			Password: randomPassword,
		})

		if err != nil {
			return echo.ErrInternalServerError
		}

		return c.JSON(http.StatusOK, "ok")
	}
}
