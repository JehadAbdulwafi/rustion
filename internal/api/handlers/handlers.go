// Code generated by go run -tags scripts scripts/handlers/gen_handlers.go; DO NOT EDIT.
package handlers

import (
	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/app"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/articles"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/auth"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/channel"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/common"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/faq"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/featured_sections"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/feedback"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/push"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/stream"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/tags"
	"github.com/JehadAbdulwafi/rustion/internal/api/handlers/tv_shows"
	"github.com/labstack/echo/v4"
)

func AttachAllRoutes(s *api.Server) {
	// attach our routes
	s.Router.Routes = []*echo.Route{
		app.DeleteAppRoute(s),
		app.GetAppListRoute(s),
		app.GetAppRoute(s),
		app.PostAppRoute(s),
		app.PutAppRoute(s),
		articles.DeleteArticleRoute(s),
		articles.GetArticleRoute(s),
		articles.GetArticlesRoute(s),
		articles.PostCreateArticleRoute(s),
		articles.PutUpdateArticleRoute(s),
		auth.GetUserInfoRoute(s),
		auth.PostChangePasswordRoute(s),
		auth.PostForgotPasswordCompleteRoute(s),
		auth.PostForgotPasswordRoute(s),
		auth.PostLoginRoute(s),
		auth.PostRefreshRoute(s),
		auth.PostRegisterRoute(s),
		auth.PutUserInfoRoute(s),
		common.GetHealthyRoute(s),
		common.GetSwaggerRoute(s),
		common.GetVersionRoute(s),
		common.PostUploadImageRoute(s),
		faq.DeleteFaqRoute(s),
		faq.GetFaqListRoute(s),
		faq.GetFaqRoute(s),
		faq.PostFaqRoute(s),
		faq.PutFaqRoute(s),
		featuredsections.DeleteFeaturedSectionRoute(s),
		featuredsections.GetAllFeaturedSectionsRoute(s),
		featuredsections.GetFeaturedSectionRoute(s),
		featuredsections.GetFeaturedSectionWithArticlesRoute(s),
		featuredsections.GetFeaturedSectionsWithArticlesRoute(s),
		featuredsections.PostCreateFeaturedSectionRoute(s),
		featuredsections.PutUpdateFeaturedArticlesRoute(s),
		featuredsections.PutUpdateFeaturedSectionRoute(s),
		feedback.DeleteFeedbackRoute(s),
		feedback.GetFeedbackListRoute(s),
		feedback.GetFeedbackRoute(s),
		feedback.PostFeedbackRoute(s),
		feedback.PutFeedbackRoute(s),
		push.GetPushTestRoute(s),
		push.PostPushNotificationsRoute(s),
		push.PostUpdatePushTokenRoute(s),
		stream.DeleteStreamRoute(s),
		stream.GetResetStreamPasswordRoute(s),
		stream.GetStreamListRoute(s),
		stream.GetStreamRoute(s),
		stream.GetStreamStatusRoute(s),
		stream.PostStreamEventsRoute(s),
		stream.PostStreamRoute(s),
		stream.PutStreamNameRoute(s),
		stream.GetForwardSecrets(s),
		stream.PostForwardSecrets(s),
		stream.GetForwardStreams(s),
		stream.PutStreamRoute(s),
		stream.GetVLiveSecrets(s),
		stream.PostVLiveSecrets(s),
		stream.GetVLiveStreams(s),
		stream.PostVLiveSource(s),
		stream.PostVLiveStreamUrl(s),
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
		channel.GetChannelRoute(s),
		channel.PutChannelRoute(s),
		channel.PostChannelRoute(s),
		channel.DeleteChannelRoute(s),
		channel.GetChannelListRoute(s),
	}
}
