package app

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/app"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/sqlc-dev/pqtype"
)

func PutAppRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1App.PUT("/:id", putAppHandler(s))
}

func putAppHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := app.NewGetAppRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		var body types.AppConfigPayload
		err = util.BindAndValidateBody(c, &body)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid body")
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

		if app.UserID != user.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		err = s.Queries.UpdateAppConfig(ctx, database.UpdateAppConfigParams{
			ID: app.ID,
			Config: pqtype.NullRawMessage{
				RawMessage: []byte(*body.Config),
				Valid:      body.Config != nil,
			},
		})

		response := types.MessageResponse{
			Message: "App config updated successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
