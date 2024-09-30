package common

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/labstack/echo/v4"
)

func GetHealthyRoute(s *api.Server) *echo.Route {
	return s.Router.Root.GET("/healthy", getHealthyHandler(s))
}

func getHealthyHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !s.Ready() {
			// We use 521 to indicate an error state
			// same as Cloudflare: https://support.cloudflare.com/hc/en-us/articles/115003011431#521error
			return c.String(521, "Not ready.")
		}

		var str strings.Builder
		fmt.Fprintln(&str, "Ready.")

		fmt.Fprintln(&str, "Probes succeeded.")

		return c.String(http.StatusOK, str.String())
	}
}
