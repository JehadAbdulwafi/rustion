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

func GetCategoryWithAriclesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Categories.GET("/:id/articles", getCategoryWithArticlesHandler(s))
}

func getCategoryWithArticlesHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		id := c.Param("id")

		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		// TODO: add check for valid uuid
		ID, err := uuid.Parse(id)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "invalid id")
		}

		Category, err := s.Queries.GetCategory(ctx, ID)
		if err != nil {
			return err
		}

		nullUUID := uuid.NullUUID{
			Valid: true,
			UUID:  ID,
		}

		Articles, err := s.Queries.GetArticlesByCategoryID(ctx, nullUUID)

		res := convertDBCategoryAndArticlesToCategoryWithArticles(Category, Articles)
		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBCategoryAndArticlesToCategoryWithArticles(category database.Category, Artictles []database.Article) *types.GetCategoryWithArticlesResponse {
	res := types.GetCategoryWithArticlesResponse{
		Category: &types.Category{
			ID:        (*strfmt.UUID4)(swag.String(category.ID.String())),
			Title:     &category.Title,
			CreatedAt: strfmt.DateTime(category.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(category.UpdatedAt.Time),
		},
		Articles: convertDBArticlesToArticles(Artictles),
	}

	return &res
}

func convertDBArticlesToArticles(articles []database.Article) []*types.GetCategoryWithArticlesResponseArticlesItems0 {
	var res []*types.GetCategoryWithArticlesResponseArticlesItems0
	for _, article := range articles {
		articleRes := &types.GetCategoryWithArticlesResponseArticlesItems0{
			ID:          (*strfmt.UUID4)(swag.String(article.ID.String())),
			Title:       &article.Title,
			Content:     &article.Content,
			Image:       &article.Image,
			Description: article.Description.String,
			CategoryID:  (*strfmt.UUID4)(swag.String(article.CategoryID.UUID.String())),
			CreatedAt:   strfmt.DateTime(article.CreatedAt.Time),
			UpdatedAt:   strfmt.DateTime(article.UpdatedAt.Time),
		}

		res = append(res, articleRes)
	}
	return res
}
