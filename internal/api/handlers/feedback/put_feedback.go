package feedback

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func PutFeedbackRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Feedback.PUT("/:id", putFeedbackHandler(s))
}

func putFeedbackHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		/* Uncomment for real implementation
		        ctx := c.Request().Context()

		        params := feedback.NewGetFeedbackRouteParams()
		        err := util.BindAndValidatePathParams(c, &params)
		        if err != nil {
		            return err
		        }
		        id := params.ID.String()

		        var body types.FeedbackPayload
				    err = util.BindAndValidateBody(c, &body)
				    if err != nil {
				    	  return err
				    }

		        // TODO: Implement
		*/

		response := types.Feedback{
			ID:        (*strfmt.UUID4)(swag.String("1606388b-1f88-4f56-bd97-c27fbc3fe080")),
			UserID:    (strfmt.UUID4)("1606388b-1f88-4f56-bd97-c27fbc3fe080"),
			Subject:   swag.String("subject"),
			Type:      swag.String("type"),
			Message:   swag.String("message"),
			CreatedAt: *swag.String("createdAt"),
			UpdatedAt: *swag.String("updatedAt"),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
