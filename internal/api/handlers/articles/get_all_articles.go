package articles

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

func GetArticlesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Articles.GET("", getArticlesHandler(s))
}

func getArticlesHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		appId := c.QueryParam("app_id")

		if appId == "" {
			return c.JSON(http.StatusBadRequest, "appId is required")
		}

		ID, err := uuid.Parse(appId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid appId")
		}

		articles, err := s.Queries.GetAllArticlesByApp(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to get all articles")
		}

		res := convertDBArticlesToArticles(articles)
		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBArticlesToArticles(articles []database.Article) types.GetArticlesResponse {
	var res types.GetArticlesResponse
	for _, article := range articles {
		articleRes := &types.Article{
			ID:          (*strfmt.UUID4)(swag.String(article.ID.String())),
			Title:       &article.Title,
			Content:     &article.Content,
			Image:       &article.Image,
			Description: article.Description.String,
			Tags:        article.Tags.String,
			AppID:       (*strfmt.UUID4)(swag.String(article.AppID.String())),
			CreatedAt:   strfmt.DateTime(article.CreatedAt.Time),
			UpdatedAt:   strfmt.DateTime(article.UpdatedAt.Time),
		}

		res = append(res, articleRes)
	}
	return res
}
