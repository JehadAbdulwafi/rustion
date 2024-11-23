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

func GetTagsWithAriclesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Tags.GET("/articles", getTagsWithArticlesHandler(s))
}

func getTagsWithArticlesHandler(s *api.Server) echo.HandlerFunc {
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

		Tags, err := s.Queries.GetTagsByApp(ctx, ID)
		if err != nil {
			return err
		}

		var res types.GetTagsWithArticlesResponse

		for _, Tag := range Tags {
			Articles, err := s.Queries.GetArticlesByTag(ctx, sql.NullString{
				String: Tag.Title,
				Valid:  true,
			})
			if err != nil {
				continue
			}

			item := convertDBTagAndArticlesToTagsWithArticles(Tag, Articles)
			res = append(res, item)

		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)

	}
}

func convertDBTagAndArticlesToTagsWithArticles(tag database.Tag, Artictles []database.Article) *types.GetTagWithArticlesResponse {
	res := types.GetTagWithArticlesResponse{
		Tag: &types.Tag{
			ID:        (*strfmt.UUID4)(swag.String(tag.ID.String())),
			Title:     &tag.Title,
			AppID:       (*strfmt.UUID4)(swag.String(tag.AppID.String())),
			CreatedAt: strfmt.DateTime(tag.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(tag.UpdatedAt.Time),
		},
		Articles: convertDBArticlesToArticles(Artictles),
	}

	return &res
}
