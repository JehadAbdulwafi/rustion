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

func GetFaqRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Faq.GET("/:id", getFaqHandler(s))
}

func getFaqHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		/* Uncomment for real implementation
		   ctx := c.Request().Context()

		   params := faq.NewGetFaqRouteParams()
		   err := util.BindAndValidatePathParams(c, &params)
		   if err != nil {
		       return err
		   }
		   id := params.ID.String()

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
