package articles

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteArticleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Articles.DELETE("/:id", deleteArticleHandler(s))
}

func deleteArticleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		id := c.Param("id")

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
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

		err = s.Queries.DeleteArticle(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return util.ValidateAndReturn(c, http.StatusOK, &types.DeleteArticleResponse{
			Message: "Article deleted successfully",
		})
	}
}
