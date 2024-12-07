package auth

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PutUserInfoRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.PUT("/userinfo", putUserInfoHandler(s))
}

func putUserInfoHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		var body types.PutUserInfoPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		if err := s.Queries.UpdateUserInfo(ctx, database.UpdateUserInfoParams{
			Name:  *body.Name,
			Email: body.Email.String(),
			ID:    user.ID,
		}); err != nil {
			return err
		}

		return c.JSON(http.StatusOK, types.MessageResponse{
			Message: "User info updated",
		})
	}
}
