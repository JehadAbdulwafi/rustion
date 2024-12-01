package feedback

import (
    "net/http"

    "github.com/JehadAbdulwafi/rustion/internal/api"
    "github.com/labstack/echo/v4"
)

func DeleteFeedbackRoute(s *api.Server) *echo.Route {
    return s.Router.APIV1Feedback.DELETE("/:id", deleteFeedbackHandler(s))
}

func deleteFeedbackHandler(s *api.Server) echo.HandlerFunc {
    return func(c echo.Context) error {
        /* Uncomment for real implementation
        ctx := c.Request().Context()

        params := feedback.NewGetFeedbackRouteParams()
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
