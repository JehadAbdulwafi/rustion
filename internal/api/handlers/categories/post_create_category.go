package categories

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostCreateCategoryRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Categories.POST("", createCategoryHandler(s))
}

func createCategoryHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		var body types.CreateCategoryRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		_, err := s.Queries.CreateCategory(ctx, *body.Name)

		if err != nil {
			return err
		}

		res := &types.CreateCategoryResponse{
			Message: "category created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
