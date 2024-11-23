package featuredsections

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

func GetFeaturedSectionRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1FeaturedSections.GET("/:id", getFeaturedSectionHandler(s))
}

func getFeaturedSectionHandler(s *api.Server) echo.HandlerFunc {
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

		FeaturedSection, err := s.Queries.GetFeaturedSection(ctx, ID)
		if err != nil {
			return err
		}

		res := &types.GetFeaturedSectionResponse{
			Section: &types.FeaturedSection{
				ID:        (*strfmt.UUID4)(swag.String(FeaturedSection.ID.String())),
				Title:     &FeaturedSection.Title,
				AppID:     (*strfmt.UUID4)(swag.String(FeaturedSection.AppID.String())),
				CreatedAt: strfmt.DateTime(FeaturedSection.CreatedAt.Time),
				UpdatedAt: strfmt.DateTime(FeaturedSection.UpdatedAt.Time),
			},
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
