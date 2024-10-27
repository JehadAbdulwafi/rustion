-- name: CreateArticle :one
INSERT INTO articles (title, content, category_id, image, description)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, title, content, category_id, created_at, updated_at;

-- name: GetArticle :one
SELECT *
FROM articles
WHERE id = $1;

-- name: UpdateArticle :one
UPDATE articles
SET title = $1, content = $2, category_id = $3, image = $4, description = $5, updated_at = CURRENT_TIMESTAMP
WHERE id = $6
RETURNING id, title, content, category_id, created_at, updated_at;

-- name: DeleteArticle :exec
DELETE FROM articles
WHERE id = $1;

-- name: GetAllArticles :many
SELECT *
FROM articles
ORDER BY created_at DESC;

-- name: GetArticlesByCategoryID :many
SELECT *
FROM articles 
WHERE category_id = $1
ORDER BY created_at DESC;
