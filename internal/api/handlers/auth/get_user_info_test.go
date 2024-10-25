package auth_test

import (
	"context"
	"net/http"
	"testing"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/test"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/go-openapi/strfmt"
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

		assert.Equal(t, fixtures.User1.ID, *response.ID)
		assert.Equal(t, strfmt.Email(fixtures.User1.Email), response.Email)
		// test.Snapshoter.Skip([]string{"UpdatedAt"}).Save(t, response)

		user, err := s.Queries.GetUserByID(ctx, fixtures.User1.ID)
		require.NoError(t, err)

		assert.Equal(t, user.Email, *response.Email)
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
		assert.Equal(t, strfmt.Email(fixtures.User1.Email), response.Email)

		user, err := s.Queries.GetUserByID(ctx, fixtures.User1.ID)
		require.NoError(t, err)

		assert.Equal(t, user.Email, *response.Email)
	})
}
