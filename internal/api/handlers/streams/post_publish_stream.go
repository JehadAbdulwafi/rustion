package streams

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostPublishStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.POST("/publish", postPublishStreamHandler(s))
}

func postPublishStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.StreamEvent
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		log.Debug().Interface("body", body).Msg("body")

		if *body.Action != util.StreamActionPublish {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid action")
		}

		// check if stream exists
		stream, err := s.Queries.GetStreamByStreamName(c.Request().Context(), *body.Stream)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "Stream not found")
		}

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

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
