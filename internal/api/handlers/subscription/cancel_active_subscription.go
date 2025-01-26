package subscription

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func DeleteCancelSubscriptionRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.DELETE("/:id/cancel", deleteCancelSubscriptionHandler(s))
}

func deleteCancelSubscriptionHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		_ = auth.UserFromContext(ctx)

		id := c.Param("id")
		if id == "" {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid subscription ID")
		}

		subscription, err := s.Queries.GetSubscription(ctx, uuid.MustParse(id))
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "Subscription not found")
		}

		if subscription.Status != database.SubscriptionStatusEnumActive {
			return echo.NewHTTPError(http.StatusNotFound, "your subscription is not active")
		}

		err = s.Queries.CancelSubscription(ctx, subscription.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.NoContent(http.StatusOK)
	}
}
