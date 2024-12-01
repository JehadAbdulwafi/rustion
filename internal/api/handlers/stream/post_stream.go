package stream

import (
	"fmt"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
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

		randomPassword, err := util.GenerateRandomString(
			10,
			[]util.CharRange{util.CharRangeAlphaLowerCase, util.CharRangeAlphaUpperCase, util.CharRangeNumeric},
			"",
		)

		if err != nil {
			return err
		}

		url := fmt.Sprintf("http://localhost:2022/live/%s", body.Name)

		stream, err := s.Queries.CreateStream(ctx, database.CreateStreamParams{
			UserID:   user.ID,
			App:      "live",
			Name:     *body.Name,
			Url:      url,
			Password: randomPassword,
		})

		if err != nil {
			return err
		}

		response := types.Stream{
			ID:              (*strfmt.UUID4)(swag.String(stream.ID.String())),
			UserID:          (*strfmt.UUID4)(swag.String(stream.UserID.String())),
			App:             &stream.App,
			Name:            &stream.Name,
			URL:             &stream.Url,
			Thumbnail:       &stream.Thumbnail.String,
			Status:          swag.String(string(stream.Status)),
			Viewers:         swag.String(string(stream.Viewers.Int32)),
			LastPublishedAt: swag.String(stream.LastPublishedAt.Time.String()),
			LiveTitle:       &stream.LiveTitle.String,
			LiveDescription: &stream.LiveDescription.String,
			CreatedAt:       stream.CreatedAt.Time.String(),
			UpdatedAt:       stream.UpdatedAt.Time.String(),
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}
