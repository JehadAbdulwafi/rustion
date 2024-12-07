package app

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/sqlc-dev/pqtype"
)

func PostAppRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1App.POST("", postAppHandler(s))
}

func postAppHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		var body types.AppPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid body")
		}

		_, err = s.Queries.CreateApp(ctx, database.CreateAppParams{
			UserID: user.ID,
			Name:   *body.Name,
			Config: pqtype.NullRawMessage{
				RawMessage: []byte(*body.Config),
				Valid:      true,
			},
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to create app")
		}

		res := types.MessageResponse{
			Message: "App created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
