// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: accounts.sql

package database

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const createAccount = `-- name: CreateAccount :one
INSERT INTO accounts (user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type
`

type CreateAccountParams struct {
	UserID            uuid.UUID
	Provider          string
	ProviderAccountID string
	RefreshToken      sql.NullString
	AccessToken       sql.NullString
	ValidUntil        time.Time
	Scope             sql.NullString
	TokenType         sql.NullString
}

func (q *Queries) CreateAccount(ctx context.Context, arg CreateAccountParams) (Account, error) {
	row := q.db.QueryRowContext(ctx, createAccount,
		arg.UserID,
		arg.Provider,
		arg.ProviderAccountID,
		arg.RefreshToken,
		arg.AccessToken,
		arg.ValidUntil,
		arg.Scope,
		arg.TokenType,
	)
	var i Account
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Provider,
		&i.ProviderAccountID,
		&i.RefreshToken,
		&i.AccessToken,
		&i.ValidUntil,
		&i.Scope,
		&i.TokenType,
	)
	return i, err
}

const deleteAccount = `-- name: DeleteAccount :exec
DELETE FROM accounts WHERE user_id = $1 AND provider_account_id = $2
`

type DeleteAccountParams struct {
	UserID            uuid.UUID
	ProviderAccountID string
}

func (q *Queries) DeleteAccount(ctx context.Context, arg DeleteAccountParams) error {
	_, err := q.db.ExecContext(ctx, deleteAccount, arg.UserID, arg.ProviderAccountID)
	return err
}

const deleteAccountsByUserID = `-- name: DeleteAccountsByUserID :exec
DELETE FROM accounts WHERE user_id = $1
`

func (q *Queries) DeleteAccountsByUserID(ctx context.Context, userID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteAccountsByUserID, userID)
	return err
}

const deleteAccountsByUserIDAndProvider = `-- name: DeleteAccountsByUserIDAndProvider :exec
DELETE FROM accounts WHERE user_id = $1 AND provider = $2
`

type DeleteAccountsByUserIDAndProviderParams struct {
	UserID   uuid.UUID
	Provider string
}

func (q *Queries) DeleteAccountsByUserIDAndProvider(ctx context.Context, arg DeleteAccountsByUserIDAndProviderParams) error {
	_, err := q.db.ExecContext(ctx, deleteAccountsByUserIDAndProvider, arg.UserID, arg.Provider)
	return err
}

const getAccountByID = `-- name: GetAccountByID :one
SELECT id, user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type FROM accounts WHERE id = $1
`

func (q *Queries) GetAccountByID(ctx context.Context, id int32) (Account, error) {
	row := q.db.QueryRowContext(ctx, getAccountByID, id)
	var i Account
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Provider,
		&i.ProviderAccountID,
		&i.RefreshToken,
		&i.AccessToken,
		&i.ValidUntil,
		&i.Scope,
		&i.TokenType,
	)
	return i, err
}

const getAccountByUserID = `-- name: GetAccountByUserID :one
SELECT id, user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type FROM accounts WHERE user_id = $1
`

func (q *Queries) GetAccountByUserID(ctx context.Context, userID uuid.UUID) (Account, error) {
	row := q.db.QueryRowContext(ctx, getAccountByUserID, userID)
	var i Account
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Provider,
		&i.ProviderAccountID,
		&i.RefreshToken,
		&i.AccessToken,
		&i.ValidUntil,
		&i.Scope,
		&i.TokenType,
	)
	return i, err
}

const getAccountByUserIDAndProviderAccountID = `-- name: GetAccountByUserIDAndProviderAccountID :one
SELECT id, user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type FROM accounts WHERE user_id = $1 AND provider_account_id = $2
`

type GetAccountByUserIDAndProviderAccountIDParams struct {
	UserID            uuid.UUID
	ProviderAccountID string
}

func (q *Queries) GetAccountByUserIDAndProviderAccountID(ctx context.Context, arg GetAccountByUserIDAndProviderAccountIDParams) (Account, error) {
	row := q.db.QueryRowContext(ctx, getAccountByUserIDAndProviderAccountID, arg.UserID, arg.ProviderAccountID)
	var i Account
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Provider,
		&i.ProviderAccountID,
		&i.RefreshToken,
		&i.AccessToken,
		&i.ValidUntil,
		&i.Scope,
		&i.TokenType,
	)
	return i, err
}

const getAccountsByUserID = `-- name: GetAccountsByUserID :many
SELECT id, user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type FROM accounts WHERE user_id = $1
`

func (q *Queries) GetAccountsByUserID(ctx context.Context, userID uuid.UUID) ([]Account, error) {
	rows, err := q.db.QueryContext(ctx, getAccountsByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Account
	for rows.Next() {
		var i Account
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Provider,
			&i.ProviderAccountID,
			&i.RefreshToken,
			&i.AccessToken,
			&i.ValidUntil,
			&i.Scope,
			&i.TokenType,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateAccount = `-- name: UpdateAccount :one
UPDATE accounts
SET refresh_token = $3, access_token = $4, valid_until = $5, scope = $6, token_type = $7
WHERE user_id = $1 AND provider_account_id = $2
RETURNING id, user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type
`

type UpdateAccountParams struct {
	UserID            uuid.UUID
	ProviderAccountID string
	RefreshToken      sql.NullString
	AccessToken       sql.NullString
	ValidUntil        time.Time
	Scope             sql.NullString
	TokenType         sql.NullString
}

func (q *Queries) UpdateAccount(ctx context.Context, arg UpdateAccountParams) (Account, error) {
	row := q.db.QueryRowContext(ctx, updateAccount,
		arg.UserID,
		arg.ProviderAccountID,
		arg.RefreshToken,
		arg.AccessToken,
		arg.ValidUntil,
		arg.Scope,
		arg.TokenType,
	)
	var i Account
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Provider,
		&i.ProviderAccountID,
		&i.RefreshToken,
		&i.AccessToken,
		&i.ValidUntil,
		&i.Scope,
		&i.TokenType,
	)
	return i, err
}

const updateAccountTokens = `-- name: UpdateAccountTokens :one
UPDATE accounts
SET refresh_token = $3, access_token = $4, valid_until = $5
WHERE user_id = $1 AND provider_account_id = $2
RETURNING id, user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type
`

type UpdateAccountTokensParams struct {
	UserID            uuid.UUID
	ProviderAccountID string
	RefreshToken      sql.NullString
	AccessToken       sql.NullString
	ValidUntil        time.Time
}

func (q *Queries) UpdateAccountTokens(ctx context.Context, arg UpdateAccountTokensParams) (Account, error) {
	row := q.db.QueryRowContext(ctx, updateAccountTokens,
		arg.UserID,
		arg.ProviderAccountID,
		arg.RefreshToken,
		arg.AccessToken,
		arg.ValidUntil,
	)
	var i Account
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Provider,
		&i.ProviderAccountID,
		&i.RefreshToken,
		&i.AccessToken,
		&i.ValidUntil,
		&i.Scope,
		&i.TokenType,
	)
	return i, err
}