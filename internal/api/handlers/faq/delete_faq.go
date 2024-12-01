package faq

import (
    "net/http"

    "github.com/JehadAbdulwafi/rustion/internal/api"
    "github.com/labstack/echo/v4"
)

func DeleteFaqRoute(s *api.Server) *echo.Route {
    return s.Router.APIV1Faq.DELETE("/:id", deleteFaqHandler(s))
}

func deleteFaqHandler(s *api.Server) echo.HandlerFunc {
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

        return c.NoContent(http.StatusNoContent)
    }
}
