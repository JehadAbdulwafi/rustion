package tv_shows

import (
	"database/sql"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PutUpdateTvShowRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1TvShows.PUT("/:id", putUpdateTvShowHandler(s))
}

func putUpdateTvShowHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		var body types.UpdateTVShowRequest
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
			return c.JSON(http.StatusInternalServerError, err)
		}

		if tvShow.AppID != userApp.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		_, err = s.Queries.UpdateTVShow(ctx, database.UpdateTVShowParams{
			ID:    uuid.MustParse(id),
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
			return c.JSON(http.StatusInternalServerError, "failed to update tv show")
		}

		return util.ValidateAndReturn(c, http.StatusOK, &types.MessageResponse{
			Message: "TV Show updated successfully.",
		})
	}
}
