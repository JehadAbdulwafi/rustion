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

func GetTvShowRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.GET("/:id", getTvShowHandler(s))
}

func getTvShowHandler(s *api.Server) echo.HandlerFunc {
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

		res := convertDBTVShowToTVShow(tvShow)

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBTVShowToTVShow(tvShow database.TvShow) *types.TVShow {
	return &types.TVShow{
		ID:          (*strfmt.UUID4)(swag.String(tvShow.ID.String())),
		Title:       &tvShow.Title,
		Genre:       tvShow.Genre.String,
		Description: tvShow.Description.String,
		Image:       &tvShow.Image.String,
		AppID:       (*strfmt.UUID4)(swag.String(tvShow.AppID.String())),
		CreatedAt:   strfmt.DateTime(tvShow.CreatedAt.Time),
		UpdatedAt:   strfmt.DateTime(tvShow.UpdatedAt.Time),
	}
}
