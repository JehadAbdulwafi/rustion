package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/stream"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.GET("/:id", getStreamHandler(s))
}

func getStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()

		params := stream.NewGetStreamRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}
		id := params.ID.String()

		streamID, err := uuid.Parse(id)
		if err != nil {
			return echo.ErrBadRequest
		}

		stream, err := s.Queries.GetStreamById(ctx, streamID)
		if err != nil {
			return echo.ErrNotFound
		}

		response := convertStreamDBToStream(&stream)

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}

func convertStreamDBToStream(stream *database.Stream) types.Stream {
	return types.Stream{
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
}
