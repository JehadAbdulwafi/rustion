package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostStreamEventsRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Stream.POST("/events", postStreamEventsHandler(s))
}

func postStreamEventsHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.StreamEvent
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		log.Debug().Interface("body", body).Msg("request body")

		// check if stream exists
		stream, err := s.Queries.GetStreamByStreamName(c.Request().Context(), *body.Stream)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "Stream not found")
		}

		switch *body.Action {
		case util.StreamActionPublish:
			err = s.Queries.PublishStream(c.Request().Context(), stream.ID)
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to publish stream")
			}
		case util.StreamActionUnpublish:
			err = s.Queries.UnpublishStream(c.Request().Context(), stream.ID)
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to unpublish stream")
			}
		default:
			log.Info().Str("action", *body.Action).Msg("invalid action")
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
