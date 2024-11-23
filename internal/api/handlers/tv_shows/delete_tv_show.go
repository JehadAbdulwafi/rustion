package tv_shows

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteTvShowRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.DELETE("/:id", deleteTvShowHandler(s))
}

func deleteTvShowHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
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
			return c.JSON(http.StatusInternalServerError, err)
		}

		if tvShow.AppID != userApp.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		err = s.Queries.DeleteTVShow(ctx, uuid.MustParse(id))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to delete tv show")
		}

		return util.ValidateAndReturn(c, http.StatusOK, &types.DeleteTVShowResponse{
			Message: "TV Show deleted successfully.",
		})
	}
}
