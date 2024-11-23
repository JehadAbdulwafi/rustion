package tv_shows

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
)

func GetAllTvShowsWithScheduleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.GET("/schedules", getAllTvShowsWithScheduleHandler(s))
}

func getAllTvShowsWithScheduleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		appId := c.QueryParam("app_id")

		if appId == "" {
			return c.JSON(http.StatusBadRequest, "appId is required")
		}

		ID, err := uuid.Parse(appId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid appId")
		}

		tvShows, err := s.Queries.GetAllTVShowsByApp(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to get tv shows")
		}

		var tvShowsWithSchedules types.GetAllTVShowsWithSchedulesResponse

		for _, tvShow := range tvShows {
			schedules, err := s.Queries.GetTVShowSchedulesByTVShowID(ctx, tvShow.ID)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, "failed to get tv show schedules")
			}

			item := &types.GetTVShowWithSchedulesResponse{
				TvShow:    convertDBTVShowToTVShow(tvShow),
				Schedules: convertDBTVShowSchedulesToTVShowSchedules(schedules),
			}

			tvShowsWithSchedules = append(tvShowsWithSchedules, item)
		}

		return util.ValidateAndReturn(c, http.StatusOK, tvShowsWithSchedules)
	}
}
