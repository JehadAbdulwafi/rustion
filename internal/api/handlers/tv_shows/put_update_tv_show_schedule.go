package tv_shows

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
)

func PutUpdateTVShowScheduleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.PUT("/:id/schedules", putUpdateTVShowScheduleHandler(s))
}

func putUpdateTVShowScheduleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		var body types.UpdateTVShowScheduleRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return c.JSON(http.StatusBadRequest, "invalid request body")
		}

		id := c.Param("id")
		if id == "" {
			return c.JSON(http.StatusBadRequest, "id is required")
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		tvShow, err := s.Queries.GetTVShowByID(ctx, uuid.MustParse(id))
		if err != nil {
			return c.JSON(http.StatusNotFound, "tv show not found")
		}

		if tvShow.AppID != userApp.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		for _, item := range body {
			layout := "15:04:05"
			parsedTime, err := time.Parse(layout, *item.Time)
			if err != nil {
				return err
			}
			err = s.Queries.UpdateTVShowSchedule(ctx, database.UpdateTVShowScheduleParams{
				TvShowID: uuid.MustParse(id),
				Day:      database.DayEnum(*item.Day),
				Time:     sql.NullTime{Time: parsedTime, Valid: true},
				IsActive: *item.IsActive,
			})

			if err != nil {
				return c.JSON(http.StatusInternalServerError, "failed to update tv show schedule")
			}
		}

		return util.ValidateAndReturn(c, http.StatusOK, &types.UpdateTVShowScheduleResponse{
			Message: "tv show schedule updated successfully",
		})
	}
}
