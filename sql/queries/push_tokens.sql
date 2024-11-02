-- name: CreatePushToken :one
INSERT INTO push_tokens (token, fingerprint, provider)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetPushToken :one
SELECT * FROM push_tokens WHERE token = $1;

-- name: GetPushTokensByID :one
SELECT * FROM push_tokens WHERE id = $1;

-- name: GetPushTokensByFingerprint :many
SELECT * FROM push_tokens WHERE fingerprint = $1;

-- name: DeletePushToken :exec
DELETE FROM push_tokens WHERE token = $1;

-- name: DeletePushTokensByFingerprint :exec
DELETE FROM push_tokens WHERE fingerprint = $1;
