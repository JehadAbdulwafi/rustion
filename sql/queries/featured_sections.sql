-- name: CreateFeaturedSection :one
INSERT INTO featured_sections (title, app_id)
VALUES ($1, $2)
RETURNING *;

-- name: GetFeaturedSection :one
SELECT *
FROM featured_sections
WHERE id = $1;

-- name: UpdateFeaturedSection :one
UPDATE featured_sections
SET title = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, title, created_at, updated_at;

-- name: DeleteFeaturedSection :exec
DELETE FROM featured_sections
WHERE id = $1;

-- name: GetFeaturedSections :many
SELECT id, title, created_at, updated_at
FROM featured_sections WHERE app_id = $1;

-- name: CreateFeaturedArticle :one
INSERT INTO featured_articles (featured_section_id, article_id)
VALUES ($1, $2)
RETURNING *;

-- name: GetFeaturedArticle :one
SELECT *
FROM featured_articles
WHERE id = $1;

-- name: UpdateFeaturedArticle :one
UPDATE featured_articles
SET featured_section_id = $1, article_id = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING *;

-- name: DeleteFeaturedArticle :exec
DELETE FROM featured_articles
WHERE id = $1;

-- name: GetFeaturedArticlesBySectionID :many
SELECT id, featured_section_id, article_id, created_at, updated_at
FROM featured_articles
WHERE featured_section_id = $1;

-- name: GetArticlesBySectionID :many
SELECT a.* FROM articles a
JOIN featured_articles fa ON a.id = fa.article_id
JOIN featured_sections fs ON fs.id = fa.featured_section_id
WHERE fs.id = $1;


