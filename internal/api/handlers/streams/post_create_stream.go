package streams

import (
	"fmt"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/labstack/echo/v4"
)

func PostCreateStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.POST("", postCreateStreamHandler(s))
}

func postCreateStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		streamRandomName, err := util.GenerateRandomString(
			10,
			[]util.CharRange{util.CharRangeAlphaLowerCase, util.CharRangeAlphaUpperCase, util.CharRangeNumeric},
			"",
		)
		if err != nil {
			return err
		}

		url := fmt.Sprintf("http://localhost:2022/live/%s", streamRandomName)

		stream, err := s.Queries.CreateStream(ctx, database.CreateStreamParams{
			UserID:     user.ID,
			App:        "live",
			StreamName: streamRandomName,
			Url:        url,
		})

		if err != nil {
			return err
		}

		id := strfmt.UUID4(stream.ID.String())
		res := &types.CreateStreamResponse{
			URL: url,
			ID:  &id,
		}

		return util.ValidateAndReturn(c, http.StatusCreated, res)
	}
}
