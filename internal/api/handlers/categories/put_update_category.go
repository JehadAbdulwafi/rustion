package categories

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PutUpdateCategoryRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Categories.PUT("/:id", updateCategoryHandler(s))
}

func updateCategoryHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		id := c.Param("id")

		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		var body types.CreateCategoryRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		_, err = s.Queries.GetCategory(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusNotFound, "category not found")
		}

		_, err = s.Queries.UpdateCategory(ctx, database.UpdateCategoryParams{
			Name: *body.Name,
			ID:   ID,
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to update category")
		}

		res := &types.UpdateCategoryResponse{
			Message: "category updated successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
