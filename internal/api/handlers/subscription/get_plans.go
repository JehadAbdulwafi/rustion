package subscription

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetPlansRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.GET("/plans", getPlansHandler(s))
}

func getPlansHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		plans, err := s.Queries.GetActivePlans(ctx)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		var res types.PlanList
		for _, item := range plans {
			item := types.Plan{
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

			res = append(res, &item)
		}

		if res == nil {
			res = types.PlanList{}
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
