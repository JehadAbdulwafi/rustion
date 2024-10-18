-- name: CreateNewsCategory :one
INSERT INTO news_categories (name)
VALUES ($1)
RETURNING id, name, created_at, updated_at;

-- name: GetNewsCategory :one
SELECT id, name, created_at, updated_at
FROM news_categories
WHERE id = $1;

-- name: UpdateNewsCategory :one
UPDATE news_categories
SET name = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, name, created_at, updated_at;

-- name: DeleteNewsCategory :exec
DELETE FROM news_categories
WHERE id = $1;

-- name: GetCategoryWithNews :one
SELECT 
    nc.id AS category_id,
    nc.name AS category_name,
    n.id AS news_id,
    n.title AS news_title,
    n.content AS news_content,
    n.created_at AS news_created_at,
    n.updated_at AS news_updated_at
FROM 
    news_categories nc
LEFT JOIN 
    news n ON nc.id = n.category_id
WHERE 
    nc.id = $1  -- Pass the category ID as a parameter
ORDER BY 
    n.created_at DESC;

-- name: GetAllCategoriesWithNews :many
SELECT 
    nc.id AS category_id,
    nc.name AS category_name,
    n.id AS news_id,
    n.title AS news_title,
    n.content AS news_content,
    n.created_at AS news_created_at,
    n.updated_at AS news_updated_at
FROM 
    news_categories nc
LEFT JOIN 
    news n ON nc.id = n.category_id
ORDER BY 
    nc.name, n.created_at DESC;