package subscription

import (
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

func PostResubscribeRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.POST("/:id/resubscribe", postResubscribeHandler(s))
}

func postResubscribeHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		_, err := s.Queries.GetUserActiveSubscription(ctx, user.ID)
		if err == nil {
			return echo.NewHTTPError(http.StatusBadRequest, "you already have an active subscription")
		}

		id := c.Param("id")
		subID := uuid.MustParse(id)
		subscription, err := s.Queries.GetSubscription(ctx, subID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "no active subscription found")
		}

		if subscription.Status != database.SubscriptionStatusEnumCancelled {
			return echo.NewHTTPError(http.StatusNotFound, "you cannot resubscribe to this plan")
		}

		if subscription.CurrentPeriodEnd.Before(time.Now()) {
			return echo.NewHTTPError(http.StatusNotFound, "you cannot resubscribe to this plan, it has expired")
		}

		resubscribed, err := s.Queries.UpdateSubscriptionStatus(ctx, database.UpdateSubscriptionStatusParams{
			ID:     subscription.ID,
			Status: database.SubscriptionStatusEnumActive,
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		res := types.Subscription{
			ID:                 (*strfmt.UUID4)(swag.String(resubscribed.ID.String())),
			UserID:             (*strfmt.UUID4)(swag.String(resubscribed.UserID.String())),
			PlanID:             (*strfmt.UUID4)(swag.String(resubscribed.PlanID.String())),
			PlanName:           subscription.PlanName,
			Status:             swag.String(string(resubscribed.Status)),
			BillingCycle:       swag.String(string(resubscribed.BillingCycle)),
			CurrentPeriodStart: (*strfmt.DateTime)(&resubscribed.CurrentPeriodStart),
			CurrentPeriodEnd:   (*strfmt.DateTime)(&resubscribed.CurrentPeriodEnd),
			CreatedAt:          strfmt.DateTime(resubscribed.CreatedAt.Time).String(),
			UpdatedAt:          strfmt.DateTime(resubscribed.UpdatedAt.Time).String(),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
