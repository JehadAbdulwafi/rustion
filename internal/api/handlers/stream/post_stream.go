package stream

import (
	"fmt"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.POST("", postStreamHandler(s))
}

func postStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)
		var body types.CreateStreamPayload
		err := util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}

		// TODO: check if user is already has a stream
		// for now we will allow user to have only one stream
		streams, err := s.Queries.GetStreamsByUserId(ctx, user.ID)
		if err != nil {
			return err
		}

		if len(streams) > 0 {
			return echo.ErrForbidden
		}

		randomPassword, err := util.GenerateRandomString(
			10,
			[]util.CharRange{util.CharRangeAlphaLowerCase, util.CharRangeAlphaUpperCase, util.CharRangeNumeric},
			"",
		)

		if err != nil {
			return err
		}

		// TODO: move to configuration
		Host := c.Request().Host
		Endpoint := util.ToSlug(*body.Name)
		scheme := c.Request().URL.Scheme
		App := "live"

		url := fmt.Sprintf("%s://%s/%s/%s", scheme, Host, App, Endpoint)

		err = s.Queries.CreateStream(ctx, database.CreateStreamParams{
			UserID:   user.ID,
			App:      App,
			Name:     Endpoint,
			Url:      url,
			Password: randomPassword,
			Host:     Host,
			Endpoint: Endpoint,
		})

		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, "stream created successfully")
	}
}
