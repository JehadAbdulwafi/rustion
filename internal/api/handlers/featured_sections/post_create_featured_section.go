package featuredsections

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostCreateFeaturedSectionRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1FeaturedSections.POST("", createFeaturedSectionHandler(s))
}

func createFeaturedSectionHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		var body types.CreateFeaturedSectionRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		_, err = s.Queries.CreateFeaturedSection(ctx, database.CreateFeaturedSectionParams{
			Title: *body.Title,
			AppID: userApp.ID,
		})

		if err != nil {
			return err
		}

		res := &types.MessageResponse{
			Message: "featured section created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
