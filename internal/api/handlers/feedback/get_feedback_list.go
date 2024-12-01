package feedback

import (
	"net/http"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetFeedbackListRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Feedback.GET("", getFeedbackListHandler(s))
}

func getFeedbackListHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		feedbacks, err := s.Queries.GetFeedbacks(ctx)
		if err != nil {
			return c.JSON(http.StatusNotFound, "feedbacks not found")
		}

		response := types.FeedbackList{}
		for _, feedback := range feedbacks {
			item := convertFeedbackDBToFeedback(feedback)
			response = append(response, &item)
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}

func convertFeedbackDBToFeedback(feedback database.Feedback) types.Feedback {
	return types.Feedback{
		ID:        (*strfmt.UUID4)(swag.String(feedback.ID.String())),
		UserID:    (strfmt.UUID4)(feedback.UserID.UUID.String()),
		Subject:   swag.String(feedback.Subject),
		Type:      swag.String(string(feedback.Type)),
		Message:   swag.String(feedback.Message),
		CreatedAt: *swag.String(feedback.CreatedAt.Time.Format(time.RFC3339)),
		UpdatedAt: *swag.String(feedback.UpdatedAt.Time.Format(time.RFC3339)),
	}
}
