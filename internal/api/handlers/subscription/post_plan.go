package subscription

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostPlanRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.POST("/plans", postPlanHandler(s))
}

func postPlanHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		var body types.PlanPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid body")
		}

		var features json.RawMessage
		err = json.Unmarshal([]byte(*body.Features), &features)
		if err != nil {
			log.Error().Err(err).Msg("failed to unmarshal features")
			return c.JSON(http.StatusBadRequest, "invalid features")
		}

		_, err = s.Queries.CreatePlan(ctx, database.CreatePlanParams{
			Name: *body.Name,
			Description: sql.NullString{
				String: *body.Description,
				Valid:  true,
			},
			Features:     features,
			PriceMonthly: *body.PriceMonthly,
			PriceYearly:  *body.PriceYearly,
			IsActive:     true,
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to create app")
		}

		res := types.MessageResponse{
			Message: "Plan created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
