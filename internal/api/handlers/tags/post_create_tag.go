package tags

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
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
		user := auth.UserFromContext(ctx)
		var body types.CreateTagRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		_, err = s.Queries.CreateTag(ctx, database.CreateTagParams{
			Title: *body.Title,
			AppID: userApp.ID,
		})

		if err != nil {
			return err
		}

		res := &types.MessageResponse{
			Message: "tag created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
