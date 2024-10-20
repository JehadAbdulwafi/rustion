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

-- name: GetCategoryWithArticles :one
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    a.id AS article_id,
    a.title AS article_title,
    a.content AS article_content,
    a.created_at AS article_created_at,
    a.updated_at AS article_updated_at
FROM 
    categories c
LEFT JOIN 
    articles a ON c.id = a.category_id
WHERE 
    c.id = $1  -- Pass the category ID as a parameter
ORDER BY 
    a.created_at DESC;

-- name: GetAllCategoriesWithArticles :many
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    a.id AS article_id,
    a.title AS article_title,
    a.content AS article_content,
    a.created_at AS article_created_at,
    a.updated_at AS article_updated_at
FROM 
    categories c
LEFT JOIN 
    articles a ON c.id = a.category_id
ORDER BY 
    c.name, a.created_at DESC;