package tags

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
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
		id := c.Param("id")

		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		_, err = s.Queries.GetTag(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusNotFound, "tag not found")
		}

		err = s.Queries.DeleteTag(ctx, ID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to update tag")
		}

		return util.ValidateAndReturn(c, http.StatusOK, nil)
	}
}
