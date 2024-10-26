package auth_test

import (
	"context"
	"net/http"
	"testing"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/test"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetUserInfo(t *testing.T) {
	test.WithTestServer(t, func(s *api.Server) {
		ctx := context.Background()
		fixtures := test.Fixtures()

		res := test.PerformRequest(t, s, "GET", "/api/v1/auth/userinfo", nil, test.HeadersWithAuth(t, fixtures.User1Account.AccessToken.String))
		require.Equal(t, http.StatusOK, res.Result().StatusCode)

		var response types.GetUserInfoResponse
		test.ParseResponseAndValidate(t, res, &response)

		log.Info().Interface("response", response).Msg("response")
		log.Info().Interface("user", fixtures.User1).Msg("user")

		// Fix for UUID comparison
		assert.Equal(t, fixtures.User1.ID, uuid.MustParse(*response.ID))

		log.Info().Interface("res id", response.ID).Msg("res id")
		log.Info().Interface("user id", fixtures.User1.ID).Msg("user id")

		// Fix for email comparison
		assert.Equal(t, fixtures.User1.Email, string(*response.Email))

		log.Info().Interface("res email", response.Email).Msg("res email")
		log.Info().Interface("user email", fixtures.User1.Email).Msg("user email")

		_, err := s.Queries.GetUserByID(ctx, fixtures.User1.ID)
		require.NoError(t, err)
	})
}

func TestGetUserInfoMinimal(t *testing.T) {
	test.WithTestServer(t, func(s *api.Server) {
		ctx := context.Background()
		fixtures := test.Fixtures()

		err := s.Queries.DeleteAccountsByUserID(ctx, fixtures.User1.ID)
		require.NoError(t, err)

		res := test.PerformRequest(t, s, "GET", "/api/v1/auth/userinfo", nil, test.HeadersWithAuth(t, fixtures.User1Account.AccessToken.String))
		require.Equal(t, http.StatusOK, res.Result().StatusCode)

		var response types.GetUserInfoResponse
		test.ParseResponseAndValidate(t, res, &response)

		assert.Equal(t, fixtures.User1.ID, *response.ID)
		// assert.Equal(t, strfmt.Email(fixtures.User1.Email), response.Email)

		user, err := s.Queries.GetUserByID(ctx, fixtures.User1.ID)
		require.NoError(t, err)

		assert.Equal(t, user.Email, *response.Email)
	})
}
