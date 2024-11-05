package tags

import (
	"database/sql"
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

func GetTagWithAriclesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Tags.GET("/:id/articles", getTagWithArticlesHandler(s))
}

func getTagWithArticlesHandler(s *api.Server) echo.HandlerFunc {
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

		Tag, err := s.Queries.GetTag(ctx, ID)
		if err != nil {
			return err
		}

		Articles, err := s.Queries.GetArticlesByTag(ctx, sql.NullString{
			String: Tag.Title,
			Valid:  true,
		})

		res := convertDBTagAndArticlesToTagWithArticles(Tag, Articles)
		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBTagAndArticlesToTagWithArticles(tag database.Tag, Artictles []database.Article) *types.GetTagWithArticlesResponse {
	res := types.GetTagWithArticlesResponse{
		Tag: &types.Tag{
			ID:        (*strfmt.UUID4)(swag.String(tag.ID.String())),
			Title:     &tag.Title,
			CreatedAt: strfmt.DateTime(tag.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(tag.UpdatedAt.Time),
		},
		Articles: convertDBArticlesToArticles(Artictles),
	}

	return &res
}

func convertDBArticlesToArticles(articles []database.Article) []*types.GetTagWithArticlesResponseArticlesItems0 {
	var res []*types.GetTagWithArticlesResponseArticlesItems0
	for _, article := range articles {
		articleRes := &types.GetTagWithArticlesResponseArticlesItems0{
			ID:          (*strfmt.UUID4)(swag.String(article.ID.String())),
			Title:       &article.Title,
			Content:     &article.Content,
			Image:       &article.Image,
			Description: article.Description.String,
			Tags:        article.Tags.String,
			CreatedAt:   strfmt.DateTime(article.CreatedAt.Time),
			UpdatedAt:   strfmt.DateTime(article.UpdatedAt.Time),
		}

		res = append(res, articleRes)
	}
	return res
}
