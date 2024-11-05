package tv_shows

import (
	"database/sql"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostCreateTvShowRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.POST("", postCreateTvShowHandler(s))
}

func postCreateTvShowHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		var body types.CreateTVShowRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return c.JSON(http.StatusBadRequest, "invalid request body")
		}

		_, err := s.Queries.CreateTVShow(ctx, database.CreateTVShowParams{
			Title: *body.Title,
			Genre: sql.NullString{
				String: body.Genre,
				Valid:  body.Genre != "",
			},
			Description: sql.NullString{
				String: body.Description,
				Valid:  body.Description != "",
			},
			Image: sql.NullString{
				String: body.Image,
				Valid:  body.Image != "",
			},
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to create tv show")
		}

		return util.ValidateAndReturn(c, http.StatusOK, &types.CreateTVShowResponse{
			Message: "TV Show created successfully.",
		})
	}
}
