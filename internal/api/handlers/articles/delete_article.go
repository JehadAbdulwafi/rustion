package articles

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
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
		id := c.Param("id")
		if id == "" {
			return c.JSON(http.StatusBadRequest, "id is required")
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
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
