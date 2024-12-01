package feedback

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PostFeedbackRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Feedback.POST("", postFeedbackHandler(s))
}

func postFeedbackHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		var body types.FeedbackPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}

		_, err = s.Queries.CreateFeedback(ctx, database.CreateFeedbackParams{
			UserID:  uuid.NullUUID{UUID: uuid.MustParse(body.UserID.String()), Valid: true},
			Subject: *body.Subject,
			Type:    database.FeedbackTypeEnum(*body.Type),
			Message: *body.Message,
		})
		if err != nil {
			return err
		}

		response := types.CreateArticleResponse{
			Message: "Feedback created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
