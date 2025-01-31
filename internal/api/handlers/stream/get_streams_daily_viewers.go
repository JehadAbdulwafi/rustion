package stream

import (
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/labstack/echo/v4"
)

type AnalyticsResponse struct {
	Data []struct {
		Date    string `json:"date"`
		Viewers int    `json:"viewers"`
	} `json:"Data"`
}

func GetStreamsDailyViewersRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/viewers", getStreamsDailyViewersHandler(s))
}

func getStreamsDailyViewersHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		endDate := time.Now().UTC()
		startDate := endDate.AddDate(0, -3, 0) // 3 months back from current date

		// Get existing data from database
		usageData, err := s.Queries.GetStreamViewersByUserIDAndDateRange(ctx,
			database.GetStreamViewersByUserIDAndDateRangeParams{
				UserID: user.ID,
				Date:   startDate,
				Date_2: endDate,
			})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "error fetching usage data")
		}

		// Create date map for quick lookup
		dateMap := make(map[string]int)
		for _, entry := range usageData {
			dateStr := entry.Date.Format("2006-01-02")
			dateMap[dateStr] = int(entry.ViewerCount)
		}

		// Generate complete date sequence with zero values
		var fullData []struct {
			Date    string `json:"date"`
			Viewers int    `json:"viewers"`
		}

		currentDate := startDate
		for currentDate.Before(endDate) || currentDate.Equal(endDate) {
			dateStr := currentDate.Format("2006-01-02")

			viewers := 0
			if val, exists := dateMap[dateStr]; exists {
				viewers = val
			}

			fullData = append(fullData, struct {
				Date    string `json:"date"`
				Viewers int    `json:"viewers"`
			}{
				Date:    dateStr,
				Viewers: viewers,
			})

			// Move to next day
			currentDate = currentDate.AddDate(0, 0, 1)
		}

		return c.JSON(http.StatusOK, AnalyticsResponse{Data: fullData})
	}
}
