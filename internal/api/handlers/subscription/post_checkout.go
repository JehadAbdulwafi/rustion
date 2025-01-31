package subscription

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostCheckoutRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.POST("/checkout", postCheckoutHandler(s))
}

func postCheckoutHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		b, err := io.ReadAll(c.Request().Body)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest,
				fmt.Sprintf("Failed to read request body: %v", err))
		}

		var webhookData struct {
			SubscriptionID string `json:"subscription_id"`
			TransactionID  string `json:"transaction_id"`
		}

		if err := json.Unmarshal(b, &webhookData); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest,
				fmt.Sprintf("Invalid request format: %v", err))
		}

		// Get the subscription
		subUUID, err := uuid.Parse(webhookData.SubscriptionID)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid subscription ID format")
		}

		subscription, err := s.Queries.GetSubscription(ctx, subUUID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "Subscription not found")
		}

		// Verify subscription is in pending state
		if subscription.Status != database.SubscriptionStatusEnumPending {
			return c.JSON(http.StatusOK, map[string]string{
				"status": "already_processed",
			})
		}

		// Update transaction first
		tx, err := s.Queries.UpdateTransactionStatus(ctx, database.UpdateTransactionStatusParams{
			ID:     uuid.MustParse(webhookData.TransactionID),
			Status: database.TransactionStatusEnumSucceeded,
		})
		if err != nil {
			log.Error().Err(err).Msg("Failed updating transaction")
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update transaction")
		}

		// Then update subscription
		updatedSub, err := s.Queries.UpdateSubscriptionStatus(ctx, database.UpdateSubscriptionStatusParams{
			ID:     subscription.ID,
			Status: database.SubscriptionStatusEnumActive,
		})
		if err != nil {
			// Important: Consider transaction status rollback here
			log.Error().Err(err).Msg("Failed updating subscription")
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update subscription")
		}

		// Update response data format as needed
		return c.JSON(http.StatusOK, map[string]interface{}{
			"subscription": updatedSub,
			"transaction":  tx,
		})
	}
}
