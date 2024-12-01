package faq

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

func GetFaqListRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Faq.GET("", getFaqListHandler(s))
}

func getFaqListHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		faqs, err := s.Queries.GetFAQs(ctx)
		if err != nil {
			return echo.ErrInternalServerError
		}

		response := types.FaqList{}
		for _, faq := range faqs {
			item := convertFaqDBToFAQ(faq)
			response = append(response, &item)
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}

func convertFaqDBToFAQ(faq database.Faq) types.Faq {
	return types.Faq{
		ID:        (*strfmt.UUID4)(swag.String(faq.ID.String())),
		Question:  swag.String(faq.Question),
		Answer:    swag.String(faq.Answer),
		CreatedAt: *swag.String(faq.CreatedAt.Time.Format(time.RFC3339)),
		UpdatedAt: *swag.String(faq.UpdatedAt.Time.Format(time.RFC3339)),
	}
}
