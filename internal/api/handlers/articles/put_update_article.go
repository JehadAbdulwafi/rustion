package articles

import (
	"database/sql"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PutUpdateArticleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Articles.PUT("/:id", updateArticleHandler(s))
}

func updateArticleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		_user := auth.UserFromContext(ctx)
		id := c.Param("id")
		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		var body types.UpdateArticleRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return c.JSON(http.StatusBadRequest, "invalid request body")
		}

		ID := uuid.MustParse(id)

		userApp, err := s.Queries.GetAppByUserID(ctx, _user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		article, err := s.Queries.GetArticle(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		if article.AppID != userApp.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		_, err = s.Queries.UpdateArticle(ctx, database.UpdateArticleParams{
			ID:      ID,
			Title:   *body.Title,
			Content: *body.Content,
			Tags: sql.NullString{
				String: body.Tags,
				Valid:  body.Tags != "",
			},
			Description: sql.NullString{
				String: body.Description,
				Valid:  body.Description != "",
			},
			Image: *body.Image,
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to update article")
		}

		return util.ValidateAndReturn(c, http.StatusOK, &types.MessageResponse{
			Message: "Article updated successfully",
		})
	}
}
