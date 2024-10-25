package common

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/config"
	"github.com/labstack/echo/v4"
)

func GetVersionRoute(s *api.Server) *echo.Route {
	return s.Router.Root.GET("/version", getVersionHandler(s))
}

// Returns the version and build date baked into the binary.
func getVersionHandler(_ *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.String(http.StatusOK, config.GetFormattedBuildArgs())
	}
}
