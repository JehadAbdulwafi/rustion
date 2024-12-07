-- name: CreateApp :one
INSERT INTO apps (user_id, name, config)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetApp :one
SELECT *
FROM apps
WHERE id = $1;

-- name: GetAppByUserID :one
SELECT *
FROM apps
WHERE user_id = $1
LIMIT 1;

-- name: UpdateApp :one
UPDATE apps
SET name = $1, config = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING *;

-- name: UpdateAppConfig :exec
UPDATE apps
SET config = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: DeleteApp :exec
DELETE FROM apps
WHERE id = $1;

-- name: GetAppsByUserID :many
SELECT * FROM apps
WHERE user_id = $1;

-- name: GetApps :many
SELECT * FROM apps;
