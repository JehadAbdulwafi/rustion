package app

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

func GetAppListRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1App.GET("", getAppListHandler(s))
}

func getAppListHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		apps, err := s.Queries.GetApps(ctx)
		if err != nil {
			return c.JSON(http.StatusNotFound, "apps not found")
		}

		response := convertDBAppsToApps(apps)

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}

func convertDBAppsToApps(apps []database.App) types.AppList {
	var res types.AppList
	for _, app := range apps {
		appRes := &types.App{
			ID:     (*strfmt.UUID4)(swag.String(app.ID.String())),
			Name:   &app.Name,
			UserID: (*strfmt.UUID4)(swag.String(app.UserID.String())),
		}

		res = append(res, appRes)
	}

	return res
}
