package featuredsections

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

func GetFeaturedSectionsWithArticlesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1FeaturedSections.GET("/articles", getFeaturedSectionsWithArticlesHandler(s))
}

func getFeaturedSectionsWithArticlesHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		FeaturedSections, err := s.Queries.GetFeaturedSections(ctx)
		if err != nil {
			return err
		}

		var res types.GetFeaturedSectionsWithArticlesResponse

		for _, section := range FeaturedSections {
			Articles, err := s.Queries.GetArticlesBySectionID(ctx, section.ID)
			if err != nil {
				return err
			}

			item := convertDBFeaturedSectionAndArticlesToFeaturedSectionWithArticles(section, Articles)
			res = append(res, item)
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBFeaturedSectionAndArticlesToFeaturedSectionWithArticles(
	section database.FeaturedSection,
	Articles []database.Article,
) *types.GetFeaturedSectionWithArticlesResponse {
	articlesRes := convertDBArticlesToArticles(Articles)
	res := &types.GetFeaturedSectionWithArticlesResponse{
		FeaturedSection: &types.FeaturedSection{
			ID:        (*strfmt.UUID4)(swag.String(section.ID.String())),
			Title:     &section.Title,
			CreatedAt: strfmt.DateTime(section.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(section.UpdatedAt.Time),
		},
		Articles: articlesRes,
	}

	return res
}
