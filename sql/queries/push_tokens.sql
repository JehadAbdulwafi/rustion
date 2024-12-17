-- name: CreatePushToken :one
INSERT INTO push_tokens (token, fingerprint, provider, app_id, created_at, updated_at)
VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;

-- name: GetPushToken :one
SELECT * FROM push_tokens WHERE token = $1;

-- name: GetPushTokenesByAppID :many
SELECT * FROM push_tokens WHERE app_id = $1;

-- name: GetPushTokensByID :one
SELECT * FROM push_tokens WHERE id = $1;

-- name: GetPushTokensByFingerprint :many
SELECT * FROM push_tokens WHERE fingerprint = $1;

-- name: DeletePushToken :exec
DELETE FROM push_tokens WHERE token = $1;

-- name: DeletePushTokensByFingerprint :exec
DELETE FROM push_tokens WHERE fingerprint = $1;
