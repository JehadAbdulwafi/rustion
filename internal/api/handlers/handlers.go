package handlers

import (
	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/articles"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/auth"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/categories"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/common"
	featuredsections "github.com/JehadAbdulwafi/rustion/internal/api/handlers/featured_sections"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/stream"
	"github.com/labstack/echo/v4"
)

func AttachAllRoutes(s *api.Server) {
	// attach our routes
	s.Router.Routes = []*echo.Route{
		common.GetHealthyRoute(s),
		auth.PostRegisterRoute(s),
		auth.PostLoginRoute(s),
		auth.GetUserInfoRoute(s),
		stream.PostCreateStreamRoute(s),
		stream.PostPublishStreamRoute(s),
		stream.PostUnpublishStreamRoute(s),
		stream.PostStopStreamRoute(s),
		stream.PostPlayStreamRoute(s),
		articles.PostCreateArticleRoute(s),
		articles.GetArticleRoute(s),
		articles.GetArticlesRoute(s),
		articles.UpdateArticleRoute(s),
		articles.DeleteArticleRoute(s),
		categories.PostCreateCategoryRoute(s),
		categories.GetCategoryRoute(s),
		categories.GetCategoryWithAriclesRoute(s),
		categories.GetCategoriesWithAriclesRoute(s),
		categories.UpdateCategoryRoute(s),
		categories.DeleteCategoryRoute(s),
		featuredsections.PostCreateFeaturedSectionRoute(s),
		featuredsections.GetFeaturedSectionRoute(s),
		featuredsections.GetFeaturedSectionWithArticlesRoute(s),
		featuredsections.GetFeaturedSectionsWithArticlesRoute(s),
		featuredsections.PutUpdateFeaturedSectionRoute(s),
		featuredsections.DeleteFeaturedSectionRoute(s),
	}
}
