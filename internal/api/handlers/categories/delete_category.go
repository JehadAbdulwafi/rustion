package categories

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteCategoryRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Categories.DELETE("/:id", deleteCategoryHandler(s))
}

func deleteCategoryHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		id := c.Param("id")

		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		_, err = s.Queries.GetCategory(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusNotFound, "category not found")
		}

		err = s.Queries.DeleteCategory(ctx, ID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to update category")
		}

		return util.ValidateAndReturn(c, http.StatusOK, nil)
	}
}
