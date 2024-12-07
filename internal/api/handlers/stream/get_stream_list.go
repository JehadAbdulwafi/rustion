package stream

import (
	"net/http"
	"strconv"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

func GetStreamListRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("", getStreamListHandler(s))
}

func getStreamListHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		streams, err := s.Queries.GetStreamsByUserId(ctx, user.ID)

		if err != nil {
			return echo.ErrInternalServerError
		}

		response := convertDBStreamsToStreams(streams)

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}

func convertDBStreamsToStreams(streams []database.GetStreamsByUserIdRow) types.StreamList {
	var result types.StreamList
	for _, stream := range streams {
		result = append(result, &types.Stream{
			ID:              (*strfmt.UUID4)(swag.String(stream.ID.String())),
			UserID:          (*strfmt.UUID4)(swag.String(stream.UserID.String())),
			App:             stream.App,
			Name:            &stream.Name,
			URL:             &stream.Url,
			Thumbnail:       &stream.Thumbnail.String,
			Status:          swag.String(string(stream.Status)),
			LastPublishedAt: *swag.String(stream.LastPublishedAt.Time.String()),
			Viewers:         swag.String(strconv.Itoa(int(stream.Viewers.Int32))),
		})
	}
	return result
}
