package streams

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
)

func PostUnpublishStreamRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Streams.POST("/unpublish", postUnpublishStreamHandler(s))
}

func postUnpublishStreamHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body types.StreamEvent
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		// check if stream exists
		stream, err := s.Queries.GetStreamByStreamName(c.Request().Context(), *body.Stream)
		if err != nil {
			return err
		}

		// TODO: check if stream belongs to user

		err = s.Queries.UnpublishStream(c.Request().Context(), stream.ID)
		if err != nil {
			return err
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}
		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
