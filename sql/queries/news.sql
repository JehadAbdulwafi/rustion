-- name: CreateNewsArticle :one
INSERT INTO news (title, content, category_id)
VALUES ($1, $2, $3)
RETURNING id, title, content, category_id, created_at, updated_at;

-- name: GetNewsArticle :one
SELECT id, title, content, category_id, created_at, updated_at
FROM news
WHERE id = $1;

-- name: UpdateNewsArticle :one
UPDATE news
SET title = $1, content = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP
WHERE id = $4
RETURNING id, title, content, category_id, created_at, updated_at;

-- name: DeleteNewsArticle :exec
DELETE FROM news
WHERE id = $1;

-- name: GetAllNewsArticles :many
SELECT id, title, content, category_id, created_at, updated_at
FROM news
ORDER BY created_at DESC;