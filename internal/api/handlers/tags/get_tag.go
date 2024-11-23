package tags

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

func GetTagRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Tags.GET("/:id", getTagHandler(s))
}

func getTagHandler(s *api.Server) echo.HandlerFunc {
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

		Tag, err := s.Queries.GetTag(ctx, ID)
		if err != nil {
			return err
		}

		res := &types.GetTagResponse{
			Tag: &types.Tag{
				ID:        (*strfmt.UUID4)(swag.String(Tag.ID.String())),
				Title:     &Tag.Title,
				AppID:     (*strfmt.UUID4)(swag.String(Tag.AppID.String())),
				CreatedAt: strfmt.DateTime(Tag.CreatedAt.Time),
				UpdatedAt: strfmt.DateTime(Tag.UpdatedAt.Time),
			},
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
