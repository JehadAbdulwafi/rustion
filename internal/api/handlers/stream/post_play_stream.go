package stream

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func PostPlayStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.POST("/play", postPublishStreamHandler(s))
}

func postPlayStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.StreamEvent
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		log.Debug().Msgf("Play stream %s", *body.Stream)

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
