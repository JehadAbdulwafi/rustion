-- name: CreateFeaturedSection :one
INSERT INTO featured_sections (title)
VALUES ($1)
RETURNING id, title, created_at, updated_at;

-- name: GetFeaturedSection :one
SELECT id, title, created_at, updated_at
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

-- name: CreateFeaturedArticle :one
INSERT INTO featured_articles (featured_section_id, article_id)
VALUES ($1, $2)
RETURNING id, featured_section_id, article_id, created_at, updated_at;

-- name: GetFeaturedArticle :one
SELECT id, featured_section_id, article_id, created_at, updated_at
FROM featured_articles
WHERE id = $1;

-- name: UpdateFeaturedArticle :one
UPDATE featured_articles
SET featured_section_id = $1, article_id = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING id, featured_section_id, article_id, created_at, updated_at;

-- name: DeleteFeaturedArticle :exec
DELETE FROM featured_articles
WHERE id = $1;

-- name: GetFeaturedArticlesBySection :many
SELECT id, featured_section_id, article_id, created_at, updated_at
FROM featured_articles
WHERE featured_section_id = $1;

-- name: GetFeaturedSectionWithArticles :one
SELECT 
    fs.id AS section_id,
    fs.title AS section_title,
    fa.id AS featured_article_id,
    fa.article_id AS article_id,
    a.title AS article_title,
    a.content AS article_content,
    fa.created_at AS featured_article_created_at,
    fa.updated_at AS featured_article_updated_at
FROM 
    featured_sections fs
LEFT JOIN 
    featured_articles fa ON fs.id = fa.featured_section_id
LEFT JOIN 
    articles a ON fa.article_id = a.id
WHERE 
    fs.id = $1  -- Pass the featured section ID as a parameter
ORDER BY 
    fa.created_at DESC;

-- name: GetAllFeaturedSectionsWithArticles :many
SELECT 
    fs.id AS section_id,
    fs.title AS section_title,
    fa.id AS featured_article_id,
    fa.article_id AS article_id,
    a.title AS article_title,
    a.content AS article_content,
    fa.created_at AS featured_article_created_at,
    fa.updated_at AS featured_article_updated_at
FROM 
    featured_sections fs
LEFT JOIN 
    featured_articles fa ON fs.id = fa.featured_section_id
LEFT JOIN 
    articles a ON fa.article_id = a.id
ORDER BY 
    fs.title, fa.created_at DESC;


