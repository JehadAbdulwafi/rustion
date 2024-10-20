-- name: CreateCategory :one
INSERT INTO categories (name)
VALUES ($1)
RETURNING id, name, created_at, updated_at;

-- name: GetCategory :one
SELECT id, name, created_at, updated_at
FROM categories
WHERE id = $1;

-- name: UpdateCategory :one
UPDATE categories
SET name = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, name, created_at, updated_at;

-- name: DeleteCategory :exec
DELETE FROM categories
WHERE id = $1;

-- name: GetCategories :many
SELECT * FROM categories;
