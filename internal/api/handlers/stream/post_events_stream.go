package stream

import (
	"net/http"
	"net/url"

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

		if body.Param == nil {
			return echo.NewHTTPError(http.StatusBadRequest, "param is required")
		}

		values, err := url.ParseQuery(*body.Param)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid param format")
		}
		password := values.Get("password")
		
		log.Debug().Str("password", password).Msg("request password")

		if password == "" {
		log.Debug().Str("password", password).Msg("password is empty")
			return echo.NewHTTPError(http.StatusBadRequest, "password is required")
		}

		stream, err := s.Queries.GetStreamByEndpoint(c.Request().Context(), *body.Stream)
		if err != nil {
			log.Error().Err(err).Msg("Failed to get stream")
			return echo.NewHTTPError(http.StatusNotFound, "Stream not found")
		}

		if password != stream.Password {
			log.Error().Msg("Invalid password")
			return echo.NewHTTPError(http.StatusUnauthorized, "Unauthorized")
		}

		switch *body.Action {
		case util.StreamActionPublish:
			err = s.Queries.PublishStream(c.Request().Context(), stream.ID)
			if err != nil {
				log.Error().Err(err).Msg("Failed to publish stream")
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to publish stream")
			}
		case util.StreamActionUnpublish:
			err = s.Queries.UnpublishStream(c.Request().Context(), stream.ID)
			if err != nil {
				log.Error().Err(err).Msg("Failed to unpublish stream")
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to unpublish stream")
			}
		default:
			log.Info().Str("action", *body.Action).Msg("invalid action")
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		log.Debug().Interface("res", res).Msg("response")

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
