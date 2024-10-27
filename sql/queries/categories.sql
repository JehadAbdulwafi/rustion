-- name: CreateCategory :one
INSERT INTO categories (title)
VALUES ($1)
RETURNING id, title, created_at, updated_at;

-- name: GetCategory :one
SELECT id, title, created_at, updated_at
FROM categories
WHERE id = $1;

-- name: UpdateCategory :one
UPDATE categories
SET title = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, title, created_at, updated_at;

-- name: DeleteCategory :exec
DELETE FROM categories
WHERE id = $1;

-- name: GetCategories :many
SELECT * FROM categories;
