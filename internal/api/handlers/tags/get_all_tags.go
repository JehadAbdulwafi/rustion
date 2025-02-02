package tags

import (
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

func GetAllTagsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Tags.GET("", getAllTagsHandler(s))
}

func getAllTagsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		appId := c.QueryParam("app_id")

		if appId == "" {
			return c.JSON(http.StatusBadRequest, "appId is required")
		}

		ID, err := uuid.Parse(appId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid appId")
		}

		Tags, err := s.Queries.GetTagsByApp(ctx, ID)
		if err != nil {
			return err
		}

		res := convertDBTagsToTags(Tags)

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}

func convertDBTagsToTags(tags []database.Tag) *types.GetTagsResponse {
	res := types.GetTagsResponse{}

	for _, tag := range tags {
		item := &types.Tag{
			ID:        (*strfmt.UUID4)(swag.String(tag.ID.String())),
			Title:     &tag.Title,
			AppID:       (*strfmt.UUID4)(swag.String(tag.AppID.String())),
			CreatedAt: strfmt.DateTime(tag.CreatedAt.Time),
			UpdatedAt: strfmt.DateTime(tag.UpdatedAt.Time),
		}
		res = append(res, item)
	}

	return &res
}
