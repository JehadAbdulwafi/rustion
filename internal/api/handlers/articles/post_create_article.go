package articles

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

func PostCreateArticleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Articles.POST("", postCreateArticleHandler(s))
}

func postCreateArticleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		var body types.CreateArticleRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return c.JSON(http.StatusBadRequest, "invalid request body")
		}

		CategoryID := uuid.NullUUID{}
		if body.CategoryID != "" {
			CategoryID.UUID = uuid.MustParse(body.CategoryID.String())
			CategoryID.Valid = true
		}

		Article, err := s.Queries.CreateArticle(ctx, database.CreateArticleParams{
			Title:      *body.Title,
			Content:    *body.Content,
			CategoryID: CategoryID,
			Description: sql.NullString{
				String: body.Description,
				Valid:  body.Description != "",
			},
			Image: *body.Image,
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to create articles")
		}

		res := types.Article{
			ID: (*strfmt.UUID4)(swag.String(Article.ID.String())),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
