-- name: CreateArticle :one
INSERT INTO articles (title, content, tags, image, description, app_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetArticle :one
SELECT *
FROM articles
WHERE id = $1;

-- name: UpdateArticle :one
UPDATE articles
SET title = $1, content = $2, tags = $3, image = $4, description = $5, updated_at = CURRENT_TIMESTAMP
WHERE id = $6
RETURNING *;

-- name: DeleteArticle :exec
DELETE FROM articles
WHERE id = $1;

-- name: GetAllArticles :many
SELECT *
FROM articles
ORDER BY created_at DESC;

-- name: GetAllArticlesByApp :many
SELECT *
FROM articles
WHERE app_id = $1
ORDER BY created_at DESC;

-- name: GetArticlesByTag :many
SELECT *
FROM articles 
WHERE tags ILIKE '%' || $1 || '%'
ORDER BY created_at DESC;

-- name: GetArticlesByTagByApp :many
SELECT *
FROM articles 
WHERE tags ILIKE '%' || $1 || '%' AND app_id = $2
ORDER BY created_at DESC;

-- name: GetArticlesByAnyTag :many
SELECT *
FROM articles
WHERE EXISTS (
    SELECT 1
    FROM unnest(string_to_array($1, ',')) AS tag
    WHERE tags ILIKE '%' || tag || '%'
);

-- name: GetArticlesByAnyTagByApp :many
SELECT *
FROM articles
WHERE EXISTS (
    SELECT 1
    FROM unnest(string_to_array($1, ',')) AS tag
    WHERE tags ILIKE '%' || tag || '%'
) AND app_id = $2;
