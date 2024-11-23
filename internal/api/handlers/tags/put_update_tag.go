package tags

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PutUpdateTagRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Tags.PUT("/:id", updateTagHandler(s))
}

func updateTagHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		id := c.Param("id")

		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		var body types.CreateTagRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		tag, err := s.Queries.GetTag(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusNotFound, "tag not found")
		}

		if tag.AppID != userApp.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		_, err = s.Queries.UpdateTag(ctx, database.UpdateTagParams{
			Title: *body.Title,
			ID:    ID,
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to update tag")
		}

		res := &types.UpdateTagResponse{
			Message: "tag updated successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
