package featuredsections

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteFeaturedSectionRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1FeaturedSections.DELETE("/:id", deleteFeaturedSectionHandler(s))
}

func deleteFeaturedSectionHandler(s *api.Server) echo.HandlerFunc {
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

		_, err = s.Queries.GetFeaturedSection(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusNotFound, "featured section not found")
		}

		err = s.Queries.DeleteFeaturedSection(ctx, ID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to update featured section")
		}

		return util.ValidateAndReturn(c, http.StatusOK, nil)

	}
}
