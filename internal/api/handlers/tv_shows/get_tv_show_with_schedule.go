package tv_shows

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetTvShowWithScheduleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.GET("/:id/schedules", getTvShowWithScheduleHandler(s))
}

func getTvShowWithScheduleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		id := c.Param("id")
		if id == "" {
			return c.JSON(http.StatusBadRequest, "id is required")
		}

		tvShow, err := s.Queries.GetTVShowByID(ctx, uuid.MustParse(id))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to get tv show")
		}

		schedules, err := s.Queries.GetTVShowSchedulesByTVShowID(ctx, uuid.MustParse(id))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to get tv show schedules")
		}

		return util.ValidateAndReturn(c, http.StatusOK, &types.GetTVShowWithSchedulesResponse{
			TvShow:    convertDBTVShowToTVShow(tvShow),
			Schedules: convertDBTVShowSchedulesToTVShowSchedules(schedules),
		})
	}
}

func convertDBTVShowSchedulesToTVShowSchedules(schedules []database.TvShowSchedule) []*types.TVShowSchedule {
	var res []*types.TVShowSchedule
	for _, schedule := range schedules {
		item := &types.TVShowSchedule{
			ID:       (*strfmt.UUID4)(swag.String(schedule.ID.String())),
			Day:      swag.String(string(schedule.Day)),
			Time:     swag.String(schedule.Time.Time.String()),
			TvShowID: (*strfmt.UUID4)(swag.String(schedule.TvShowID.String())),
			IsActive: &schedule.IsActive,
		}
		res = append(res, item)
	}
	return res
}
