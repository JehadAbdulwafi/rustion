package streams

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostStreamEventsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.POST("/events", postStreamEventsHandler(s))
}

func postStreamEventsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.StreamEvent
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		// check if stream exists
		stream, err := s.Queries.GetStreamByStreamName(c.Request().Context(), *body.Stream)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "Stream not found")
		}

		switch *body.Action {
		case util.StreamActionPublish:
			streamMetadata, err := s.Queries.GetStreamMetadata(c.Request().Context(), stream.ID)
			if err != nil {
				return echo.NewHTTPError(http.StatusNotFound, "Stream Status not found")
			}

			// TODO: check if stream belongs to user
			if streamMetadata.Status == database.StreamStatusEnumPublished {
				return echo.NewHTTPError(http.StatusForbidden, "Stream is live")
			}

			err = s.Queries.PublishStream(c.Request().Context(), stream.ID)
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to publish stream")
			}
		case util.StreamActionUnpublish:
			streamMetadata, err := s.Queries.GetStreamMetadata(c.Request().Context(), stream.ID)
			if err != nil {
				return echo.NewHTTPError(http.StatusNotFound, "Stream Status not found")
			}

			// TODO: check if stream belongs to user
			if streamMetadata.Status == database.StreamStatusEnumUnpublished {
				return echo.NewHTTPError(http.StatusForbidden, "Stream is not live")
			}

			err = s.Queries.UnpublishStream(c.Request().Context(), stream.ID)
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to unpublish stream")
			}
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
