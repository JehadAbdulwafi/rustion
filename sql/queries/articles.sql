-- name: CreateArticle :one
INSERT INTO articles (title, content, category_id)
VALUES ($1, $2, $3)
RETURNING id, title, content, category_id, created_at, updated_at;

-- name: GetArticle :one
SELECT id, title, content, category_id, created_at, updated_at
FROM articles
WHERE id = $1;

-- name: UpdateArticle :one
UPDATE articles
SET title = $1, content = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP
WHERE id = $4
RETURNING id, title, content, category_id, created_at, updated_at;

-- name: DeleteArticle :exec
DELETE FROM articles
WHERE id = $1;

-- name: GetAllArticles :many
SELECT id, title, content, category_id, created_at, updated_at
FROM articles
ORDER BY created_at DESC;