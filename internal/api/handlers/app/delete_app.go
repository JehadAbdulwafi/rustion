package app

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types/app"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteAppRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1App.DELETE("/:id", deleteAppHandler(s))
}

func deleteAppHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := app.NewGetAppRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}

		id := params.ID.String()
		ID, err := uuid.Parse(id)

		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		app, err := s.Queries.GetApp(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusNotFound, "app not found")
		}

		if app.UserID != user.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		// TODO: delete every thing related to this app

		err = s.Queries.DeleteApp(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to delete app")
		}

		return c.NoContent(http.StatusNoContent)
	}
}
