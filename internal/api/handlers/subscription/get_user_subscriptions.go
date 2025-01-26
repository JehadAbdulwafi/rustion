package subscription

import (
	"database/sql"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetSubscriptionListRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.GET("", getSubscriptionListHandler(s))
}

func getSubscriptionListHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		activeSub, err := s.Queries.GetUserSubscriptions(ctx, user.ID)

		if err != nil {
			if err == sql.ErrNoRows {
				return echo.NewHTTPError(http.StatusNotFound, "subscription not found")
			}
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		var res types.SubscriptionList

		for _, sub := range activeSub {
			res = append(res, &types.Subscription{
				ID:                 (*strfmt.UUID4)(swag.String(sub.ID.String())),
				UserID:             (*strfmt.UUID4)(swag.String(sub.UserID.String())),
				PlanID:             (*strfmt.UUID4)(swag.String(sub.PlanID.String())),
				PlanName:           string(sub.PlanName),
				Status:             swag.String(string(sub.Status)),
				BillingCycle:       swag.String(string(sub.BillingCycle)),
				CurrentPeriodStart: (*strfmt.DateTime)(&sub.CurrentPeriodStart),
				CurrentPeriodEnd:   (*strfmt.DateTime)(&sub.CurrentPeriodEnd),
				CreatedAt:          strfmt.DateTime(sub.CreatedAt.Time).String(),
				UpdatedAt:          strfmt.DateTime(sub.UpdatedAt.Time).String(),
			})
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
