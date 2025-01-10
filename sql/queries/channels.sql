-- name: CreateChannel :exec
INSERT INTO channels (user_id, platform, server, secret, label, enabled, custom)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetChannel :one
SELECT * FROM channels WHERE id = $1 AND user_id = $2;

-- name: GetChannels :many
SELECT * FROM channels WHERE user_id = $1;

-- name: UpdateChannel :exec
UPDATE channels
SET platform = $3, server = $4, secret = $5, enabled = $6, custom = $7, label = $8, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND user_id = $2;

-- name: DeleteChannel :exec
DELETE FROM channels WHERE id = $1 AND user_id = $2;

