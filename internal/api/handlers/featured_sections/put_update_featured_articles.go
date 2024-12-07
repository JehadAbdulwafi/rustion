package featuredsections

import (
	"database/sql"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PutUpdateFeaturedArticlesRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1FeaturedSections.PUT("/:id/articles", updateFeaturedArticlesHandler(s))
}

func updateFeaturedArticlesHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		id := c.Param("id")

		if id == "" {
			return c.JSON(http.StatusInternalServerError, "id is required")
		}

		var body types.UpdateFeaturedArticlesRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		ID, err := uuid.Parse(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "invalid id")
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		FeaturedSection, err := s.Queries.GetFeaturedSection(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		if FeaturedSection.AppID != userApp.ID {
			return c.JSON(http.StatusUnauthorized, "unauthorized")
		}

		featuredArticles, err := s.Queries.GetFeaturedArticlesBySectionID(ctx, ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		currentArticlesMap := make(map[uuid.UUID]bool)
		for _, article := range featuredArticles {
			currentArticlesMap[article.ArticleID] = true
		}

		newArticlesMap := make(map[uuid.UUID]bool)
		for _, articleId := range body {
			parsedID, err := uuid.Parse(articleId.String())
			if err != nil {
				log.Warn().Err(err).Msgf("skipping invalid article ID: %v", articleId)
				continue
			}

			_, err = s.Queries.GetArticle(ctx, parsedID)
			if err != nil {
				if err == sql.ErrNoRows {
					log.Warn().Msgf("skipping non-existent article ID: %v", parsedID)
					continue
				}
				log.Error().Err(err).Msgf("failed to validate article ID: %v", parsedID)
				return c.JSON(http.StatusInternalServerError, "failed to validate articles")
			}
			newArticlesMap[parsedID] = true
		}

		for articleID := range newArticlesMap {
			if !currentArticlesMap[articleID] {
				_, err := s.Queries.CreateFeaturedArticle(ctx, database.CreateFeaturedArticleParams{
					FeaturedSectionID: ID,
					ArticleID:         articleID,
				})
				if err != nil {
					log.Error().Err(err).Msg("failed to add article")
					return c.JSON(http.StatusInternalServerError, "failed to add article")
				}
			}
		}

		for _, article := range featuredArticles {
			if !newArticlesMap[article.ArticleID] {
				err := s.Queries.DeleteFeaturedArticle(ctx, article.ID)
				if err != nil {
					log.Error().Err(err).Msg("failed to remove article")
					return c.JSON(http.StatusInternalServerError, "failed to remove article")
				}
			}
		}

		res := &types.MessageResponse{
			Message: "featured articles updated successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
