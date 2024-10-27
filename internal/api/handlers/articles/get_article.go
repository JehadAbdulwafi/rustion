package articles

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

func GetArticleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Articles.GET("/:id", getArticleHandler(s))
}

func getArticleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		id := c.Param("id")
		if id == "" {
			return c.JSON(http.StatusBadRequest, "id is required")
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		article, err := s.Queries.GetArticle(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to get article")
		}

		res := types.Article{
			ID:         (*strfmt.UUID4)(swag.String(article.ID.String())),
			Title:      &article.Title,
			Content:    &article.Content,
			Image:      &article.Image,
			Description: article.Description.String,
			CategoryID: (*strfmt.UUID4)(swag.String(article.CategoryID.UUID.String())),
			CreatedAt:  strfmt.DateTime(article.CreatedAt.Time),
			UpdatedAt:  strfmt.DateTime(article.UpdatedAt.Time),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
