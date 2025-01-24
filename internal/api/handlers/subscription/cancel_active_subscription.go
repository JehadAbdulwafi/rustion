package subscription

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/labstack/echo/v4"
)

func DeleteCancelSubscriptionRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.DELETE("/cancel", deleteCancelSubscriptionHandler(s))
}

func deleteCancelSubscriptionHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		subscription, err := s.Queries.GetUserActiveSubscription(ctx, user.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "No active subscription found")
		}

		err = s.Queries.CancelSubscription(ctx, subscription.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.NoContent(http.StatusOK)
	}
}
