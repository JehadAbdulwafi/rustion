package subscription

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func PostRenewRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.POST("/renew", postRenewHandler(s))
}

func postRenewHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		// Get current subscription
		subscription, err := s.Queries.GetUserActiveSubscription(ctx, user.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "no active subscription found")
		}

		// Calculate new period dates
		var endDate time.Time
		switch subscription.BillingCycle {
		case database.SubscriptionBillingCycleEnumMonthly:
			endDate = subscription.CurrentPeriodEnd.AddDate(0, 1, 0)
		case database.SubscriptionBillingCycleEnumYearly:
			endDate = subscription.CurrentPeriodEnd.AddDate(1, 0, 0)
		default:
			return echo.NewHTTPError(http.StatusBadRequest, "invalid billing cycle")
		}

		// Update subscription period
		renewedSubscription, err := s.Queries.UpdateSubscriptionPeriod(ctx, database.UpdateSubscriptionPeriodParams{
			ID:                 subscription.ID,
			CurrentPeriodEnd:   endDate,
			CurrentPeriodStart: time.Now(),
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// Get plan for transaction amount
		plan, err := s.Queries.GetPlan(ctx, subscription.PlanID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// Create renewal transaction
		var amount string
		switch subscription.BillingCycle {
		case database.SubscriptionBillingCycleEnumMonthly:
			amount = plan.PriceMonthly
		case database.SubscriptionBillingCycleEnumYearly:
			amount = plan.PriceYearly
		}

		_, err = s.Queries.CreateTransaction(ctx, database.CreateTransactionParams{
			SubscriptionID: subscription.ID,
			Amount:         amount,
			Currency:       "LYD",
			PaymentMethod:  sql.NullString{String: "cash", Valid: true},
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		res := types.Subscription{
			ID:                 (*strfmt.UUID4)(swag.String(renewedSubscription.ID.String())),
			UserID:             (*strfmt.UUID4)(swag.String(renewedSubscription.UserID.String())),
			PlanID:             (*strfmt.UUID4)(swag.String(renewedSubscription.PlanID.String())),
			Status:             swag.String(string(renewedSubscription.Status)),
			BillingCycle:       swag.String(string(renewedSubscription.BillingCycle)),
			CurrentPeriodStart: (*strfmt.DateTime)(&renewedSubscription.CurrentPeriodStart),
			CurrentPeriodEnd:   (*strfmt.DateTime)(&renewedSubscription.CurrentPeriodEnd),
			CreatedAt:          strfmt.DateTime(renewedSubscription.CreatedAt.Time).String(),
			UpdatedAt:          strfmt.DateTime(renewedSubscription.UpdatedAt.Time).String(),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
