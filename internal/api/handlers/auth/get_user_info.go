package auth

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetUserInfoRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Auth.GET("/userinfo", getUserInfoHandler(s))
}

func getUserInfoHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		email := strfmt.Email(user.Email)
		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		var appID *string
		if err == nil && userApp.ID != uuid.Nil {
			appIDStr := userApp.ID.String()
			appID = &appIDStr
		}

		response := &types.GetUserInfoResponse{
			Email: &email,
			ID:    swag.String(user.ID.String()),
			Name:  &user.Name,
			AppID: *swag.String(util.StringValue(appID)), // safely handle nil appID
		}

		return util.ValidateAndReturn(c, http.StatusOK, response)
	}
}
