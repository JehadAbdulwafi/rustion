package stream

import (
	"database/sql"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/types/stream"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func PutStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.PUT("/:id", putStreamHandler(s))
}

func putStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		user := auth.UserFromContext(ctx)

		params := stream.NewGetStreamRouteParams()
		err := util.BindAndValidatePathParams(c, &params)
		if err != nil {
			return err
		}
		id := params.ID.String()

		var body types.UpdateStreamPayload
		err = util.BindAndValidateBody(c, &body)
		if err != nil {
			return err
		}

		streamID, err := uuid.Parse(id)
		if err != nil {
			return echo.ErrBadRequest
		}

		stream, err := s.Queries.GetStreamById(ctx, streamID)
		if err != nil {
			return echo.ErrNotFound
		}

		if stream.UserID != user.ID {
			return echo.ErrUnauthorized
		}

		_, err = s.Queries.UpdateStreamInfo(ctx, database.UpdateStreamInfoParams{
			ID:              stream.ID,
			Thumbnail:       sql.NullString{String: body.Thumbnail, Valid: body.Thumbnail != ""},
			LiveTitle:       sql.NullString{String: body.LiveTitle, Valid: body.LiveTitle != ""},
			LiveDescription: sql.NullString{String: body.LiveDescription, Valid: body.LiveDescription != ""},
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
