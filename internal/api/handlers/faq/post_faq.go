package faq

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func PostFaqRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Faq.POST("", postFaqHandler(s))
}

func postFaqHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		/* Uncomment for real implementation
		        ctx := c.Request().Context()

		        var body types.FaqPayload
				    err := util.BindAndValidateBody(c, &body)
				    if err != nil {
				    	  return err
				    }

		        // TODO: Implement
		*/

		response := types.Faq{
			ID:        (*strfmt.UUID4)(swag.String("1606388b-1f88-4f56-bd97-c27fbc3fe080")),
			Question:  swag.String("question"),
			Answer:    swag.String("answer"),
			CreatedAt: *swag.String("createdAt"),
			UpdatedAt: *swag.String("updatedAt"),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
