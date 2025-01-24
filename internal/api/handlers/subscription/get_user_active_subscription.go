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

		activeSub, err := s.Queries.GetUserActiveSubscription(ctx, user.ID)

		if err != nil {
			if err == sql.ErrNoRows {
				return echo.NewHTTPError(http.StatusNotFound, "subscription not found")
			}
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		res := types.Subscription{
			ID:                 (*strfmt.UUID4)(swag.String(activeSub.ID.String())),
			UserID:             (*strfmt.UUID4)(swag.String(activeSub.UserID.String())),
			PlanID:             (*strfmt.UUID4)(swag.String(activeSub.PlanID.String())),
			Status:             swag.String(string(activeSub.Status)),
			BillingCycle:       swag.String(string(activeSub.BillingCycle)),
			CurrentPeriodStart: (*strfmt.DateTime)(&activeSub.CurrentPeriodStart),
			CurrentPeriodEnd:   (*strfmt.DateTime)(&activeSub.CurrentPeriodEnd),
			CreatedAt:          strfmt.DateTime(activeSub.CreatedAt.Time).String(),
			UpdatedAt:          strfmt.DateTime(activeSub.UpdatedAt.Time).String(),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
