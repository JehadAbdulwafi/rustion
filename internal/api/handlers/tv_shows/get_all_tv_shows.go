package tv_shows

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetAllTvShowsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.GET("", getAllTvShowsHandler(s))
}

func getAllTvShowsHandler(s *api.Server) echo.HandlerFunc {
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

		res := convertDBTVShowsToTVShows(tvShows)
		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBTVShowsToTVShows(tvShows []database.TvShow) types.GetTVShowsResponse {
	var res types.GetTVShowsResponse
	for _, tvShow := range tvShows {
		tvShowRes := convertDBTVShowToTVShow(tvShow)
		res = append(res, tvShowRes)
	}
	return res
}
