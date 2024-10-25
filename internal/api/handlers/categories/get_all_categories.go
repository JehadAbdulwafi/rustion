package categories

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetAllCategoriesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Categories.GET("", getAllCategoriesHandler(s))
}

func getAllCategoriesHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		Categories, err := s.Queries.GetCategories(ctx)
		if err != nil {
			return err
		}

		res := convertDBCategoriesToCategories(Categories)

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBCategoriesToCategories(categoryies []database.Category) *types.GetCategoriesResponse {
	res := types.GetCategoriesResponse{}

	for _, category := range categoryies {
		item := &types.Category{
			ID:        (*strfmt.UUID4)(swag.String(category.ID.String())),
			Name:      &category.Name,
			CreatedAt: strfmt.DateTime(category.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(category.UpdatedAt.Time),
		}
		res = append(res, item)
	}

	return &res
}
