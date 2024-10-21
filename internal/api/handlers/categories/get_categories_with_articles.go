package categories

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

func GetCategoriesWithAriclesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Categories.GET("/articles", getCategoriesWithArticlesHandler(s))
}

func getCategoriesWithArticlesHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		Categories, err := s.Queries.GetCategories(ctx)
		if err != nil {
			return err
		}

		var res types.GetCategoriesWithArticlesResponse

		for _, Category := range Categories {
			nullUUID := uuid.NullUUID{
				Valid: true,
				UUID:  Category.ID,
			}

			Articles, err := s.Queries.GetArticlesByCategoryID(ctx, nullUUID)
			if err != nil {
				continue
			}

			item := convertDBCategoryAndArticlesToCategoriesWithArticles(Category, Articles)
			res = append(res, item)

		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)

	}
}

func convertDBCategoryAndArticlesToCategoriesWithArticles(category database.Category, Artictles []database.Article) *types.GetCategoryWithArticlesResponse {
	res := types.GetCategoryWithArticlesResponse{
		Category: &types.Category{
			ID:        (*strfmt.UUID4)(swag.String(category.ID.String())),
			Name:      &category.Name,
			CreatedAt: strfmt.DateTime(category.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(category.UpdatedAt.Time),
		},
		Articles: convertDBArticlesToArticles(Artictles),
	}

	return &res
}
