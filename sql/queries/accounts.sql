-- name: CreateAccount :one
INSERT INTO accounts (user_id, provider, provider_account_id, refresh_token, access_token, valid_until, scope, token_type)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: GetAccountByID :one
SELECT * FROM accounts WHERE id = $1;

-- name: GetAccountsByUserID :many
SELECT * FROM accounts WHERE user_id = $1;

-- name: GetAccountByUserID :one
SELECT * FROM accounts WHERE user_id = $1;

-- name: GetAccountByUserIDAndProviderAccountID :one
SELECT * FROM accounts WHERE user_id = $1 AND provider_account_id = $2;

-- name: UpdateAccount :one
UPDATE accounts
SET refresh_token = $3, access_token = $4, valid_until = $5, scope = $6, token_type = $7
WHERE user_id = $1 AND provider_account_id = $2
RETURNING *;

-- name: UpdateAccountTokens :one
UPDATE accounts
SET refresh_token = $3, access_token = $4, valid_until = $5
WHERE user_id = $1 AND provider_account_id = $2
RETURNING *;

-- name: DeleteAccount :exec
DELETE FROM accounts WHERE user_id = $1 AND provider_account_id = $2;

-- name: DeleteAccountsByUserID :exec
DELETE FROM accounts WHERE user_id = $1;

-- name: DeleteAccountsByUserIDAndProvider :exec
DELETE FROM accounts WHERE user_id = $1 AND provider = $2;
