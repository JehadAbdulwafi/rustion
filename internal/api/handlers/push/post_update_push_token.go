package push

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/httperrors"
	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

func PostUpdatePushTokenRoute(s *api.Server) *echo.Route {
	return s.Router.APIV1Push.PUT("/token", postUpdatePushTokenHandler(s))
}

func postUpdatePushTokenHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		log := util.LogFromContext(ctx)

		var body types.PostUpdatePushTokenPayload
		if err := util.BindAndValidateBody(c, &body); err != nil {
			return err
		}

		// insert new token
		if _, err := s.Queries.CreatePushToken(ctx, database.CreatePushTokenParams{
			Provider:    database.ProviderTypeFcm,
			Token:       *body.NewToken,
			Fingerprint: *body.Fingerprint,
		}); err != nil {
			log.Debug().Str("fingerprint", *body.Fingerprint).Err(err).Msg("Failed to insert push token.")

			// check for unique_violation on token column, 23505 == unique_violation
			var pqErr *pq.Error
			if errors.As(err, &pqErr) {
				if pqErr.Code == "23505" && pqErr.Constraint == "push_tokens_token_key" {
					return httperrors.ErrConflictPushToken
				}
			}

			return err
		}

		// delete old token if present in request
		if body.OldToken != nil {
			oldToken, err := s.Queries.GetPushToken(ctx, *body.OldToken)
			if err != nil {
				log.Debug().Str("fingerprint", *body.Fingerprint).Err(err).Msg("Old token to delete not found or not assigned to body.")
				if errors.Is(err, sql.ErrNoRows) {
					return httperrors.ErrNotFoundOldPushToken
				}

				return err
			}

			if err := s.Queries.DeletePushToken(ctx, oldToken.Token); err != nil {
				log.Debug().Str("fingerprint", *body.Fingerprint).Err(err).Msg("Failed to delete old push token.")
				return err
			}
		}

		log.Debug().Str("fingerprint", *body.Fingerprint).Msg("Successfully updated push token.")

		return c.String(http.StatusOK, "Success")
	}
}
