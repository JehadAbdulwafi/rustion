package stream

import (
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetStreamDailyViewersRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/viewers/:stream_id", getStreamDailyViewersHandler(s))
}

func getStreamDailyViewersHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		streamID := c.Param("stream_id")
		if streamID == "" {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid stream id")
		}

		endDate := time.Now()
		startDate := endDate.AddDate(0, -3, 0) // 3 months back from current date

		usageData, err := s.Queries.GetStreamViewersByDateRange(ctx, database.GetStreamViewersByDateRangeParams{
			StreamID: uuid.MustParse(streamID),
			Date:     startDate,
			Date_2:   endDate,
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
