package tags

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostCreateTagRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Tags.POST("", createTagHandler(s))
}

func createTagHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		var body types.CreateTagRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		_, err := s.Queries.CreateTag(ctx, *body.Title)

		if err != nil {
			return err
		}

		res := &types.CreateTagResponse{
			Message: "tag created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
