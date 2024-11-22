-- name: CreateTag :one
INSERT INTO tags (title, app_id)
VALUES ($1, $2)
RETURNING *;

-- name: GetTag :one
SELECT id, title, created_at, updated_at
FROM tags
WHERE id = $1;

-- name: UpdateTag :one
UPDATE tags
SET title = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, title, created_at, updated_at;

-- name: DeleteTag :exec
DELETE FROM tags
WHERE id = $1;

-- name: GetTags :many
SELECT * FROM tags
WHERE app_id = $1;
