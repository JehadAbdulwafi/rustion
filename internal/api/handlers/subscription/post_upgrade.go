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
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PostUpgradeRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.POST("/upgrade", postUpgradeHandler(s))
}

func postUpgradeHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		var body types.SubscriptionPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}

		// Get current subscription
		currentSub, err := s.Queries.GetUserActiveSubscription(ctx, user.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "no active subscription found")
		}

		// Get new plan
		newPlan, err := s.Queries.GetPlan(ctx, uuid.MustParse(body.PlanID.String()))
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "plan not found")
		}

		// Calculate new period dates based on billing cycle
		var endDate time.Time
		switch database.SubscriptionBillingCycleEnum(*body.BillingCycle) {
		case database.SubscriptionBillingCycleEnumMonthly:
			endDate = time.Now().AddDate(0, 1, 0)
		case database.SubscriptionBillingCycleEnumYearly:
			endDate = time.Now().AddDate(1, 0, 0)
		default:
			return echo.NewHTTPError(http.StatusBadRequest, "invalid billing cycle")
		}

		// Update subscription
		upgradedSubscription, err := s.Queries.UpgradeSubscription(ctx, database.UpgradeSubscriptionParams{
			ID:                 currentSub.ID,
			PlanID:             uuid.MustParse(body.PlanID.String()),
			BillingCycle:       database.SubscriptionBillingCycleEnum(*body.BillingCycle),
			CurrentPeriodStart: time.Now(),
			CurrentPeriodEnd:   endDate,
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		// Create transaction for the upgrade
		var amount string
		switch database.SubscriptionBillingCycleEnum(*body.BillingCycle) {
		case database.SubscriptionBillingCycleEnumMonthly:
			amount = newPlan.PriceMonthly
		case database.SubscriptionBillingCycleEnumYearly:
			amount = newPlan.PriceYearly
		}

		_, err = s.Queries.CreateTransaction(ctx, database.CreateTransactionParams{
			SubscriptionID: upgradedSubscription.ID,
			Amount:         amount,
			Currency:       "LYD",
			PaymentMethod:  sql.NullString{String: "cash", Valid: true},
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		res := types.Subscription{
			ID:                 (*strfmt.UUID4)(swag.String(upgradedSubscription.ID.String())),
			UserID:             (*strfmt.UUID4)(swag.String(upgradedSubscription.UserID.String())),
			PlanID:             (*strfmt.UUID4)(swag.String(upgradedSubscription.PlanID.String())),
			Status:             swag.String(string(upgradedSubscription.Status)),
			BillingCycle:       swag.String(string(upgradedSubscription.BillingCycle)),
			CurrentPeriodStart: (*strfmt.DateTime)(&upgradedSubscription.CurrentPeriodStart),
			CurrentPeriodEnd:   (*strfmt.DateTime)(&upgradedSubscription.CurrentPeriodEnd),
			CreatedAt:          strfmt.DateTime(upgradedSubscription.CreatedAt.Time).String(),
			UpdatedAt:          strfmt.DateTime(upgradedSubscription.UpdatedAt.Time).String(),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
