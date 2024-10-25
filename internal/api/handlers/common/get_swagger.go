package common

import (
	"path/filepath"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/labstack/echo/v4"
)

func GetSwaggerRoute(s *api.Server) *echo.Route {
	return s.Echo.File("/swagger.yml", filepath.Join("/api", "swagger.yml"))
}
