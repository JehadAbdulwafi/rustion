package app

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/sqlc-dev/pqtype"
)

func PostAppRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1App.POST("", postAppHandler(s))
}

func postAppHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		_ = auth.UserFromContext(ctx)

		var body types.AppPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid body")
		}

		userID, err := uuid.Parse(body.UserID.String())
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid userId")
		}

		app, err := s.Queries.CreateApp(ctx, database.CreateAppParams{
			UserID: userID,
			Name:   *body.Name,
			Config: pqtype.NullRawMessage{
				RawMessage: []byte(*body.Config),
				Valid:      true,
			},
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to create app")
		}

		res := types.App{
			ID:     (*strfmt.UUID4)(swag.String(app.ID.String())),
			UserID: (*strfmt.UUID4)(swag.String(app.UserID.String())),
			Name:   body.Name,
			Config: body.Config,
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
