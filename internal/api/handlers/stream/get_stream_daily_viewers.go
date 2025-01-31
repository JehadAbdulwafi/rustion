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
		startDate := endDate.AddDate(0, 0, -30)

		usageData, err := s.Queries.GetStreamViewersByDateRange(ctx, database.GetStreamViewersByDateRangeParams{
			StreamID: uuid.MustParse(streamID),
			Date:     startDate,
			Date_2:   endDate,
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
