package subscription

import (
	"net/http"
	"strings"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/util/subscription"
	"github.com/labstack/echo/v4"
)

type AnalyticsResponse struct {
	CurrentPlan struct {
		Name   string `json:"name"`
		Limits struct {
			MaxStreamingMinutesPerDay int64 `json:"maxStreamingMinutesPerDay"`
			MaxStorageBytes           int64 `json:"maxStorageBytes"`
			MaxPlatformConnections    int   `json:"maxPlatformConnections"`
		} `json:"limits"`
	} `json:"currentPlan"`
	UsageData []struct {
		Date               string `json:"date"`
		StreamingMinutes   int    `json:"streamingMinutes"`
		StorageUsedBytes   int64  `json:"storageUsedBytes"`
		PlatformsConnected int    `json:"platformsConnected"`
	} `json:"usageData"`
}

func GetAnalyticsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.GET("/analytics", getAnalyticsHandler(s))
}

func getAnalyticsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		// Get user's active subscription
		activeSubscription, err := s.Queries.GetUserActiveSubscription(ctx, user.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "no active subscription found")
		}

		// Get subscription plan
		plan, err := s.Queries.GetPlan(ctx, activeSubscription.PlanID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "error fetching plan details")
		}

		// Get plan limits
		planLimits := subscription.GetPlanLimits(strings.ToLower(plan.Name))

		// Get usage data for the last 30 days
		endDate := time.Now()
		startDate := endDate.AddDate(0, 0, -30)

		usageData, err := s.Queries.GetUserUsageByDateRange(ctx, database.GetUserUsageByDateRangeParams{
			UserID:      user.ID,
			UsageDate:   startDate,
			UsageDate_2: endDate,
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "error fetching usage data")
		}

		enableChannelsCount, err := s.Queries.GetChannelEnabled(ctx, user.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "error fetching enable channels count")
		}

		// Prepare response
		response := AnalyticsResponse{}
		response.CurrentPlan.Name = plan.Name
		response.CurrentPlan.Limits.MaxStreamingMinutesPerDay = planLimits.MaxStreamingMinutesPerDay
		response.CurrentPlan.Limits.MaxStorageBytes = planLimits.MaxStorageBytes
		response.CurrentPlan.Limits.MaxPlatformConnections = planLimits.MaxPlatformConnections

		// Format usage data
		response.UsageData = make([]struct {
			Date               string `json:"date"`
			StreamingMinutes   int    `json:"streamingMinutes"`
			StorageUsedBytes   int64  `json:"storageUsedBytes"`
			PlatformsConnected int    `json:"platformsConnected"`
		}, len(usageData))

		for i, usage := range usageData {
			response.UsageData[i] = struct {
				Date               string `json:"date"`
				StreamingMinutes   int    `json:"streamingMinutes"`
				StorageUsedBytes   int64  `json:"storageUsedBytes"`
				PlatformsConnected int    `json:"platformsConnected"`
			}{
				Date:               usage.UsageDate.Format("2006-01-02"),
				StreamingMinutes:   int(usage.StreamingMinutesUsed),
				StorageUsedBytes:   usage.StorageUsedBytes,
				PlatformsConnected: int(enableChannelsCount),
			}
		}

		return c.JSON(http.StatusOK, response)
	}
}
