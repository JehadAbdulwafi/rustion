package middleware

import (
	"context"
	"database/sql"
	"net/http"
	"strings"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/httperrors"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/util/subscription"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

var (
	ErrDailyStreamingLimitExceeded = httperrors.NewHTTPError(http.StatusForbidden, "DAILY_STREAMING_LIMIT_EXCEEDED", "Daily streaming limit exceeded")
	ErrStorageLimitExceeded        = httperrors.NewHTTPError(http.StatusForbidden, "STORAGE_LIMIT_EXCEEDED", "Storage limit exceeded")
	ErrPlatformLimitExceeded       = httperrors.NewHTTPError(http.StatusForbidden, "PLATFORM_LIMIT_EXCEEDED", "Platform connection limit exceeded")
	ErrSubscriptionRequired        = httperrors.NewHTTPError(http.StatusForbidden, "SUBSCRIPTION_REQUIRED", "Subscription required")
	ErrSubscriptionExpired         = httperrors.NewHTTPError(http.StatusForbidden, "SUBSCRIPTION_EXPIRED", "Subscription expired")
)

// ValidateSubscription checks if a user has an active subscription and validates limits
// This function can be called directly by other middleware (like auth middleware)
func ValidateSubscription(ctx context.Context, s *api.Server, userID uuid.UUID) error {
	activeSubs, err := s.Queries.GetUserActiveSubscription(ctx, userID)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Debug().Str("user_id", userID.String()).Msg("No active subscription found")
			return ErrSubscriptionRequired
		}
		log.Error().Err(err).Str("user_id", userID.String()).Msg("Failed to retrieve subscription")
		return echo.ErrInternalServerError
	}

	if activeSubs.Status != "active" {
		log.Debug().Str("status", string(activeSubs.Status)).Str("user_id", userID.String()).Msg("Subscription is not active")
		return ErrSubscriptionExpired
	}

	planLimits := subscription.GetPlanLimits(strings.ToLower(activeSubs.PlanName))
	return checkAllLimits(ctx, s.Queries, userID, planLimits)
}

func checkAllLimits(ctx context.Context, db *database.Queries, userID uuid.UUID, limits subscription.PlanLimits) error {
	if err := checkStreamingLimits(ctx, db, userID, limits); err != nil {
		return err
	}
	if err := checkStorageLimits(ctx, db, userID, limits); err != nil {
		return err
	}
	if err := CheckPlatformLimits(ctx, db, userID, limits); err != nil {
		return err
	}
	return nil
}

func checkStreamingLimits(ctx context.Context, db *database.Queries, userID uuid.UUID, limits subscription.PlanLimits) error {
	if limits.MaxStreamingMinutesPerDay == -1 {
		return nil // Unlimited streaming
	}

	usage, err := db.GetDailyStreamingUsage(ctx, database.GetDailyStreamingUsageParams{
		UserID:    userID,
		UsageDate: time.Now(),
	})
	if err != nil {
		return err
	}

	if int64(usage) >= limits.MaxStreamingMinutesPerDay {
		return ErrDailyStreamingLimitExceeded
	}

	return nil
}

func checkStorageLimits(ctx context.Context, db *database.Queries, userID uuid.UUID, limits subscription.PlanLimits) error {
	if limits.MaxStorageBytes == -1 {
		return nil // Unlimited storage
	}

	usage, err := db.GetStorageUsage(ctx, userID)
	if err != nil {
		return err
	}

	if usage >= limits.MaxStorageBytes {
		return ErrStorageLimitExceeded
	}

	return nil
}

func CheckPlatformLimits(ctx context.Context, db *database.Queries, userID uuid.UUID, limits subscription.PlanLimits) error {
	if limits.MaxPlatformConnections == -1 {
		return nil // Unlimited platforms
	}

	count, err := db.GetActivePlatformConnectionsCount(ctx, userID)
	if err != nil {
		return err
	}

	if int(count) >= limits.MaxPlatformConnections {
		return ErrPlatformLimitExceeded
	}

	return nil
}
