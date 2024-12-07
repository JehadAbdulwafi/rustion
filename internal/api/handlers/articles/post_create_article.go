package articles

import (
	"database/sql"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostCreateArticleRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Articles.POST("", postCreateArticleHandler(s))
}

func postCreateArticleHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		var body types.CreateArticleRequest
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return c.JSON(http.StatusBadRequest, "invalid request body")
		}

		userApp, err := s.Queries.GetAppByUserID(ctx, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to get user app")
		}

		_, err = s.Queries.CreateArticle(ctx, database.CreateArticleParams{
			Title:   *body.Title,
			Content: *body.Content,
			Tags: sql.NullString{
				String: body.Tags,
				Valid:  body.Tags != "",
			},
			Description: sql.NullString{
				String: body.Description,
				Valid:  body.Description != "",
			},
			Image: *body.Image,
			AppID: userApp.ID,
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, "failed to create articles")
		}

		res := types.MessageResponse{
			Message: "article created successfully",
		}

		return util.ValidateAndReturn(c, http.StatusOK, &res)
	}
}
