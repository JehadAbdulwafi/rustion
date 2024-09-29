-- name: CreatePushToken :one
INSERT INTO push_tokens (token, provider, user_id)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetPushToken :one
SELECT * FROM push_tokens WHERE token = $1;

-- name: GetPushTokensByUserID :many
SELECT * FROM push_tokens WHERE user_id = $1;

-- name: GetPushTokensByUserIDAndProvider :many
SELECT * FROM push_tokens WHERE user_id = $1 AND provider = $2;

-- name: DeletePushToken :exec
DELETE FROM push_tokens WHERE token = $1;

-- name: DeletePushTokensByUserID :exec
DELETE FROM push_tokens WHERE user_id = $1;

-- name: DeletePushTokensByUserIDAndProvider :exec
DELETE FROM push_tokens WHERE user_id = $1 AND provider = $2;
