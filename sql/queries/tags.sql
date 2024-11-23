-- name: CreateTag :one
INSERT INTO tags (title, app_id)
VALUES ($1, $2)
RETURNING *;

-- name: GetTag :one
SELECT *
FROM tags
WHERE id = $1;

-- name: UpdateTag :one
UPDATE tags
SET title = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;

-- name: DeleteTag :exec
DELETE FROM tags
WHERE id = $1;

-- name: GetTags :many
SELECT * FROM tags;

-- name: GetTagsByApp :many
SELECT * FROM tags
WHERE app_id = $1;
