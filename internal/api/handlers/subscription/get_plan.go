package subscription

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/subscription"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetPlanRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.GET("/plans/:id", getPlanHandler(s))
}

func getPlanHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		params := subscription.NewGetPlanRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}
		id := uuid.MustParse(params.ID.String())

		item, err := s.Queries.GetPlan(ctx, id)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "plan not found")
		}

		response := types.Plan{
			ID:           (*strfmt.UUID4)(swag.String(item.ID.String())),
			Name:         swag.String(item.Name),
			Description:  swag.String(item.Description.String),
			PriceMonthly: swag.String(item.PriceMonthly),
			PriceYearly:  swag.String(item.PriceYearly),
			Features:     swag.String(string(item.Features)),
			IsActive:     swag.Bool(item.IsActive),
			CreatedAt:    strfmt.DateTime(item.CreatedAt.Time).String(),
			UpdatedAt:    strfmt.DateTime(item.UpdatedAt.Time).String(),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
