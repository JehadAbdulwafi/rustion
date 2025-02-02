// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: articles.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const createArticle = `-- name: CreateArticle :one
INSERT INTO articles (title, content, tags, image, description, app_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, title, description, content, image, tags, app_id, created_at, updated_at
`

type CreateArticleParams struct {
	Title       string
	Content     string
	Tags        sql.NullString
	Image       string
	Description sql.NullString
	AppID       uuid.UUID
}

func (q *Queries) CreateArticle(ctx context.Context, arg CreateArticleParams) (Article, error) {
	row := q.db.QueryRowContext(ctx, createArticle,
		arg.Title,
		arg.Content,
		arg.Tags,
		arg.Image,
		arg.Description,
		arg.AppID,
	)
	var i Article
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Description,
		&i.Content,
		&i.Image,
		&i.Tags,
		&i.AppID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteArticle = `-- name: DeleteArticle :exec
DELETE FROM articles
WHERE id = $1
`

func (q *Queries) DeleteArticle(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteArticle, id)
	return err
}

const getAllArticles = `-- name: GetAllArticles :many
SELECT id, title, description, content, image, tags, app_id, created_at, updated_at
FROM articles
ORDER BY created_at DESC
`

func (q *Queries) GetAllArticles(ctx context.Context) ([]Article, error) {
	rows, err := q.db.QueryContext(ctx, getAllArticles)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Article
	for rows.Next() {
		var i Article
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.Content,
			&i.Image,
			&i.Tags,
			&i.AppID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getAllArticlesByApp = `-- name: GetAllArticlesByApp :many
SELECT id, title, description, content, image, tags, app_id, created_at, updated_at
FROM articles
WHERE app_id = $1
ORDER BY created_at DESC
`

func (q *Queries) GetAllArticlesByApp(ctx context.Context, appID uuid.UUID) ([]Article, error) {
	rows, err := q.db.QueryContext(ctx, getAllArticlesByApp, appID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Article
	for rows.Next() {
		var i Article
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.Content,
			&i.Image,
			&i.Tags,
			&i.AppID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getArticle = `-- name: GetArticle :one
SELECT id, title, description, content, image, tags, app_id, created_at, updated_at
FROM articles
WHERE id = $1
`

func (q *Queries) GetArticle(ctx context.Context, id uuid.UUID) (Article, error) {
	row := q.db.QueryRowContext(ctx, getArticle, id)
	var i Article
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Description,
		&i.Content,
		&i.Image,
		&i.Tags,
		&i.AppID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getArticlesByAnyTag = `-- name: GetArticlesByAnyTag :many
SELECT id, title, description, content, image, tags, app_id, created_at, updated_at
FROM articles
WHERE EXISTS (
    SELECT 1
    FROM unnest(string_to_array($1, ',')) AS tag
    WHERE tags ILIKE '%' || tag || '%'
)
`

func (q *Queries) GetArticlesByAnyTag(ctx context.Context, stringToArray string) ([]Article, error) {
	rows, err := q.db.QueryContext(ctx, getArticlesByAnyTag, stringToArray)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Article
	for rows.Next() {
		var i Article
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.Content,
			&i.Image,
			&i.Tags,
			&i.AppID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getArticlesByAnyTagByApp = `-- name: GetArticlesByAnyTagByApp :many
SELECT id, title, description, content, image, tags, app_id, created_at, updated_at
FROM articles
WHERE EXISTS (
    SELECT 1
    FROM unnest(string_to_array($1, ',')) AS tag
    WHERE tags ILIKE '%' || tag || '%'
) AND app_id = $2
`

type GetArticlesByAnyTagByAppParams struct {
	StringToArray string
	AppID         uuid.UUID
}

func (q *Queries) GetArticlesByAnyTagByApp(ctx context.Context, arg GetArticlesByAnyTagByAppParams) ([]Article, error) {
	rows, err := q.db.QueryContext(ctx, getArticlesByAnyTagByApp, arg.StringToArray, arg.AppID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Article
	for rows.Next() {
		var i Article
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.Content,
			&i.Image,
			&i.Tags,
			&i.AppID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getArticlesByTag = `-- name: GetArticlesByTag :many
SELECT id, title, description, content, image, tags, app_id, created_at, updated_at
FROM articles 
WHERE tags ILIKE '%' || $1 || '%'
ORDER BY created_at DESC
`

func (q *Queries) GetArticlesByTag(ctx context.Context, dollar_1 sql.NullString) ([]Article, error) {
	rows, err := q.db.QueryContext(ctx, getArticlesByTag, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Article
	for rows.Next() {
		var i Article
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.Content,
			&i.Image,
			&i.Tags,
			&i.AppID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getArticlesByTagByApp = `-- name: GetArticlesByTagByApp :many
SELECT id, title, description, content, image, tags, app_id, created_at, updated_at
FROM articles 
WHERE tags ILIKE '%' || $1 || '%' AND app_id = $2
ORDER BY created_at DESC
`

type GetArticlesByTagByAppParams struct {
	Column1 sql.NullString
	AppID   uuid.UUID
}

func (q *Queries) GetArticlesByTagByApp(ctx context.Context, arg GetArticlesByTagByAppParams) ([]Article, error) {
	rows, err := q.db.QueryContext(ctx, getArticlesByTagByApp, arg.Column1, arg.AppID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Article
	for rows.Next() {
		var i Article
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.Content,
			&i.Image,
			&i.Tags,
			&i.AppID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateArticle = `-- name: UpdateArticle :one
UPDATE articles
SET title = $1, content = $2, tags = $3, image = $4, description = $5, updated_at = CURRENT_TIMESTAMP
WHERE id = $6
RETURNING id, title, description, content, image, tags, app_id, created_at, updated_at
`

type UpdateArticleParams struct {
	Title       string
	Content     string
	Tags        sql.NullString
	Image       string
	Description sql.NullString
	ID          uuid.UUID
}

func (q *Queries) UpdateArticle(ctx context.Context, arg UpdateArticleParams) (Article, error) {
	row := q.db.QueryRowContext(ctx, updateArticle,
		arg.Title,
		arg.Content,
		arg.Tags,
		arg.Image,
		arg.Description,
		arg.ID,
	)
	var i Article
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Description,
		&i.Content,
		&i.Image,
		&i.Tags,
		&i.AppID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
