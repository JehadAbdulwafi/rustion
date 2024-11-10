// Code generated by go run -tags scripts scripts/handlers/gen_handlers.go; DO NOT EDIT.
package handlers

import (
	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/articles"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/auth"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/common"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/featured_sections"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/push"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/streams"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/tags"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/tv_shows"
	"github.com/labstack/echo/v4"
)

func AttachAllRoutes(s *api.Server) {
	// attach our routes
	s.Router.Routes = []*echo.Route{
		articles.DeleteArticleRoute(s),
		articles.GetArticleRoute(s),
		articles.GetArticlesRoute(s),
		articles.PostCreateArticleRoute(s),
		articles.PutUpdateArticleRoute(s),
		auth.GetUserInfoRoute(s),
		auth.PostLoginRoute(s),
		auth.PostRegisterRoute(s),
		common.GetHealthyRoute(s),
		common.GetSwaggerRoute(s),
		common.GetVersionRoute(s),
		featuredsections.DeleteFeaturedSectionRoute(s),
		featuredsections.GetAllFeaturedSectionsRoute(s),
		featuredsections.GetFeaturedSectionRoute(s),
		featuredsections.GetFeaturedSectionWithArticlesRoute(s),
		featuredsections.GetFeaturedSectionsWithArticlesRoute(s),
		featuredsections.PostCreateFeaturedSectionRoute(s),
		featuredsections.PutUpdateFeaturedSectionRoute(s),
		push.GetPushTestRoute(s),
		push.PostUpdatePushTokenRoute(s),
		streams.GetStreamStatusRoute(s),
		streams.PostCreateStreamRoute(s),
		streams.PostPlayStreamRoute(s),
		streams.PostPublishStreamRoute(s),
		streams.PostStopStreamRoute(s),
		streams.PostUnpublishStreamRoute(s),
		tags.DeleteTagRoute(s),
		tags.GetAllTagsRoute(s),
		tags.GetTagRoute(s),
		tags.GetTagWithAriclesRoute(s),
		tags.GetTagsWithAriclesRoute(s),
		tags.PostCreateTagRoute(s),
		tags.PutUpdateTagRoute(s),
		tv_shows.DeleteTvShowRoute(s),
		tv_shows.GetAllTvShowsRoute(s),
		tv_shows.GetAllTvShowsWithScheduleRoute(s),
		tv_shows.GetTvShowRoute(s),
		tv_shows.GetTvShowWithScheduleRoute(s),
		tv_shows.PostCreateTvShowRoute(s),
		tv_shows.PutUpdateTVShowScheduleRoute(s),
		tv_shows.PutUpdateTvShowRoute(s),
	}
}
