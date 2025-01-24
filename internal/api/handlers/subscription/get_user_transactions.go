package subscription

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetUserTransactionsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Subscription.GET("/transactions", getUserTransactionsHandler(s))
}

func getUserTransactionsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		trans, err := s.Queries.GetUserTransactions(ctx, user.ID)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		var res types.TransactionList
		for _, tran := range trans {
			item := types.Transaction{
				ID:             (*strfmt.UUID4)(swag.String(tran.ID.String())),
				SubscriptionID: (*strfmt.UUID4)(swag.String(tran.SubscriptionID.String())),
				Amount:         swag.String(tran.Amount),
				Currency:       swag.String(tran.Currency),
				Status:         swag.String(string(tran.Status)),
				PaymentMethod:  swag.String(string(tran.PaymentMethod.String)),
				ErrorMessage:   swag.String(tran.ErrorMessage.String),
				CreatedAt:      *swag.String(tran.CreatedAt.Time.String()),
				UpdatedAt:      *swag.String(tran.UpdatedAt.Time.String()),
			}

			res = append(res, &item)
		}

		if res == nil {
			res = types.TransactionList{}
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
