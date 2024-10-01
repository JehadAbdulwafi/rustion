package handlers

import (
	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/auth"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/common"
	"github.com/labstack/echo/v4"
)

func AttachAllRoutes(s *api.Server) {
	// attach our routes
	s.Router.Routes = []*echo.Route{
		common.GetHealthyRoute(s),
		auth.PostRegisterRoute(s),
		auth.PostLoginRoute(s),
		auth.GetUserInfoRoute(s),
	}
}
