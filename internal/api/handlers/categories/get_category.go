package categories

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetCategoryRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Categories.GET("/:id", getCategoryHandler(s))
}

func getCategoryHandler(s *api.Server) echo.HandlerFunc {
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

		Category, err := s.Queries.GetCategory(ctx, ID)
		if err != nil {
			return err
		}

		res := &types.GetCategoryResponse{
			Category: &types.Category{
				ID:        (*strfmt.UUID4)(swag.String(Category.ID.String())),
				Name:      &Category.Name,
				CreatedAt: strfmt.DateTime(Category.CreatedAt.Time),
				UpdatedAt: strfmt.DateTime(Category.UpdatedAt.Time),
			},
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
