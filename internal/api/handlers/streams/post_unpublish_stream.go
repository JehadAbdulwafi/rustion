package streams

import (
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/database"
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

		if *body.Action != util.StreamActionUnpublish {
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
		if streamMetadata.Status == database.StreamStatusEnumUnpublished {
			return echo.NewHTTPError(http.StatusForbidden, "Stream is not live")
		}

		err = s.Queries.UnpublishStream(c.Request().Context(), stream.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to unpublish stream")
		}

		code := int64(0)
		res := &types.StreamEventResponse{
			Code: &code,
		}

		return util.ValidateAndReturn(c, http.StatusOK, res)
	}
}
