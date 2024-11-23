package tags

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteTagRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Tags.DELETE("/:id", deleteTagHandler(s))
}

func deleteTagHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		id := c.Param("id")

		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		tag, err := s.Queries.GetTag(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusNotFound, "tag not found")
		}

		if tag.AppID != userApp.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		err = s.Queries.DeleteTag(ctx, ID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to update tag")
		}

		return util.ValidateAndReturn(c, http.StatusOK, nil)
	}
}
