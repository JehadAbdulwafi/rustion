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

func PostPlayStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.POST("/play", postPlayStreamHandler(s))
}

func postPlayStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.StreamEvent
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		if *body.Action != util.StreamActionPlay {
			log.Debug().Msg("Invalid action")
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid action")
		}

		// check if stream exists
		stream, err := s.Queries.GetStreamByStreamName(c.Request().Context(), *body.Stream)
		if err != nil {
			log.Debug().Msg("Stream not found")
			return echo.NewHTTPError(http.StatusNotFound, "Stream not found")
		}

		streamStatus, err := s.Queries.GetStreamStatus(c.Request().Context(), stream.ID)
		if err != nil {
			log.Debug().Msg("Stream Status not found")
			return echo.NewHTTPError(http.StatusNotFound, "Stream Status not found")
		}

		// TODO: check if stream belongs to user
		if streamStatus.Status == database.StreamStatusEnumOffline {
			log.Debug().Msg("Stream is not live")
			return echo.NewHTTPError(http.StatusForbidden, "Stream is not live")
		}

		err = s.Queries.IncrementStreamStatusViewersCount(c.Request().Context(), stream.ID)

		if err != nil {
			log.Debug().Msg("Failed to increment stream viewers count")
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to increment stream viewers count")
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
