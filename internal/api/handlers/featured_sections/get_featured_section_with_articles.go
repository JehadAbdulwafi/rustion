package featuredsections

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

func GetFeaturedSectionWithArticlesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1FeaturedSections.GET("/:id/articles", getFeaturedSectionWithArticlesHandler(s))
}

func getFeaturedSectionWithArticlesHandler(s *api.Server) echo.HandlerFunc {
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

		FeaturedSection, err := s.Queries.GetFeaturedSection(ctx, ID)
		if err != nil {
			return err
		}

		Articles, err := s.Queries.GetArticlesBySectionID(ctx, ID)
		if err != nil {
			return err
		}

		res := &types.GetFeaturedSectionWithArticlesResponse{
			FeaturedSection: &types.FeaturedSection{
				ID:        (*strfmt.UUID4)(swag.String(FeaturedSection.ID.String())),
				Title:     &FeaturedSection.Title,
				CreatedAt: strfmt.DateTime(FeaturedSection.CreatedAt.Time),
				UpdatedAt: strfmt.DateTime(FeaturedSection.UpdatedAt.Time),
			},
			Articles: convertDBArticlesToArticles(Articles),
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBArticlesToArticles(articles []database.Article) []*types.GetFeaturedSectionWithArticlesResponseArticlesItems0 {
	var res []*types.GetFeaturedSectionWithArticlesResponseArticlesItems0
	for _, article := range articles {
		articleRes := &types.GetFeaturedSectionWithArticlesResponseArticlesItems0{
			ID:         (*strfmt.UUID4)(swag.String(article.ID.String())),
			Title:      &article.Title,
			Content:    &article.Content,
			CategoryID: (*strfmt.UUID4)(swag.String(article.CategoryID.UUID.String())),
			CreatedAt:  strfmt.DateTime(article.CreatedAt.Time),
			UpdatedAt:  strfmt.DateTime(article.UpdatedAt.Time),
		}

		res = append(res, articleRes)
	}
	return res
}
