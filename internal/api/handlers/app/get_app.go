package app

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/app"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetAppRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1App.GET("/:id", getAppHandler(s))
}

func getAppHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		params := app.NewGetAppRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}
		id := params.ID.String()
		ID, err := uuid.Parse(id)

		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		app, err := s.Queries.GetApp(ctx, ID)

		if err != nil {
			return c.JSON(http.StatusNotFound, "app not found")
		}

		config, err := app.Config.RawMessage.MarshalJSON()
		ConfigStr := string(config)

		res := &types.App{
			ID:     (*strfmt.UUID4)(swag.String(app.ID.String())),
			Config: &ConfigStr,
			Name:   &app.Name,
			UserID: (*strfmt.UUID4)(swag.String(app.ID.String())),
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
