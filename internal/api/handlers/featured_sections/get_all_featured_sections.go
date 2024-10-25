package featuredsections

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetAllFeaturedSectionsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1FeaturedSections.GET("", getAllFeaturedSectionsHandler(s))
}

func getAllFeaturedSectionsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		FeaturedSections, err := s.Queries.GetFeaturedSections(ctx)
		if err != nil {
			return err
		}

		res := convertDBFeaturedSectionsToFeaturedSections(FeaturedSections)

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBFeaturedSectionsToFeaturedSections(
	sections []database.FeaturedSection,
) *types.GetFeaturedSectionsResponse {
	res := types.GetFeaturedSectionsResponse{}

	for _, section := range sections {
		item := &types.FeaturedSection{
			ID:        (*strfmt.UUID4)(swag.String(section.ID.String())),
			Title:     &section.Title,
			CreatedAt: strfmt.DateTime(section.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(section.UpdatedAt.Time),
		}

		res = append(res, item)
	}

	return &res
}
