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
	return s.Router.APIV1Subscription.GET("/analytics", getStreamsDailyViewersHandler(s))
}

func getStreamsDailyViewersHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		endDate := time.Now()
		startDate := endDate.AddDate(0, 0, -30)

		usageData, err := s.Queries.GetStreamViewersByUserIDAndDateRange(ctx, database.GetStreamViewersByUserIDAndDateRangeParams{
			UserID: user.ID,
			Date:   startDate,
			Date_2: endDate,
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "error fetching usage data")
		}

		response := AnalyticsResponse{}
		response.Data = make([]struct {
			Date    string `json:"date"`
			Viewers int    `json:"viewers"`
		}, len(usageData))

		for i, usage := range usageData {
			response.Data[i] = struct {
				Date    string `json:"date"`
				Viewers int    `json:"viewers"`
			}{
				Date:    usage.Date.Format("2006-01-02"),
				Viewers: int(usage.ViewerCount),
			}
		}

		return c.JSON(http.StatusOK, response)
	}
}
