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

func PostSubscribeRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.POST("/subscribe", postSubscriptionHandler(s))
}

func postSubscriptionHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		var body types.SubscriptionPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}


		_, err = s.Queries.GetUserActiveSubscription(ctx, user.ID)

		if err == nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "you already have an active subscription")
		}

		plan, err := s.Queries.GetPlan(ctx, uuid.MustParse(body.PlanID.String()))
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "plan not found")
		}

		var StartDate time.Time
		var EndDate time.Time
		switch database.SubscriptionBillingCycleEnum(*body.BillingCycle) {
		case database.SubscriptionBillingCycleEnumMonthly:
			StartDate = time.Now()
			EndDate = time.Now().AddDate(0, 1, 0)
		case database.SubscriptionBillingCycleEnumYearly:
			StartDate = time.Now()
			EndDate = time.Now().AddDate(1, 0, 0)
		default:
			StartDate = time.Now()
		}

		subscription, err := s.Queries.CreateSubscription(
			ctx,
			database.CreateSubscriptionParams{
				UserID:             user.ID,
				PlanID:             uuid.MustParse(body.PlanID.String()),
				BillingCycle:       database.SubscriptionBillingCycleEnum(*body.BillingCycle),
				Status:             database.SubscriptionStatusEnumPending,
				CurrentPeriodStart: StartDate,
				CurrentPeriodEnd:   EndDate,
			},
		)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}
		var Amount string
		switch database.SubscriptionBillingCycleEnum(*body.BillingCycle) {
		case database.SubscriptionBillingCycleEnumMonthly:
			Amount = plan.PriceMonthly
		case database.SubscriptionBillingCycleEnumYearly:
			Amount = plan.PriceYearly
		default:
			Amount = "0"
		}

		_, err = s.Queries.CreateTransaction(ctx, database.CreateTransactionParams{
			SubscriptionID: subscription.ID,
			Amount:         Amount,
			Currency:       "LYD",
			PaymentMethod:  sql.NullString{String: "cash", Valid: true},
		})

		if err != nil {
			// delete the subscription if transaction creation failed
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		res := types.Subscription{
			ID:                 (*strfmt.UUID4)(swag.String(subscription.ID.String())),
			UserID:             (*strfmt.UUID4)(swag.String(subscription.UserID.String())),
			PlanID:             (*strfmt.UUID4)(swag.String(subscription.PlanID.String())),
			Status:             swag.String(string(subscription.Status)),
			BillingCycle:       swag.String(string(subscription.BillingCycle)),
			CurrentPeriodStart: (*strfmt.DateTime)(&subscription.CurrentPeriodStart),
			CurrentPeriodEnd:   (*strfmt.DateTime)(&subscription.CurrentPeriodEnd),
			CreatedAt:          strfmt.DateTime(subscription.CreatedAt.Time).String(),
			UpdatedAt:          strfmt.DateTime(subscription.UpdatedAt.Time).String(),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
