// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: tags.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const createTag = `-- name: CreateTag :one
INSERT INTO tags (title, app_id)
VALUES ($1, $2)
RETURNING id, title, app_id, created_at, updated_at
`

type CreateTagParams struct {
	Title string
	AppID uuid.UUID
}

func (q *Queries) CreateTag(ctx context.Context, arg CreateTagParams) (Tag, error) {
	row := q.db.QueryRowContext(ctx, createTag, arg.Title, arg.AppID)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.AppID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteTag = `-- name: DeleteTag :exec
DELETE FROM tags
WHERE id = $1
`

func (q *Queries) DeleteTag(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteTag, id)
	return err
}

const getTag = `-- name: GetTag :one
SELECT id, title, app_id, created_at, updated_at
FROM tags
WHERE id = $1
`

func (q *Queries) GetTag(ctx context.Context, id uuid.UUID) (Tag, error) {
	row := q.db.QueryRowContext(ctx, getTag, id)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.AppID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getTags = `-- name: GetTags :many
SELECT id, title, app_id, created_at, updated_at FROM tags
`

func (q *Queries) GetTags(ctx context.Context) ([]Tag, error) {
	rows, err := q.db.QueryContext(ctx, getTags)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Tag
	for rows.Next() {
		var i Tag
		if err := rows.Scan(
			&i.ID,
			&i.Title,
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

const getTagsByApp = `-- name: GetTagsByApp :many
SELECT id, title, app_id, created_at, updated_at FROM tags
WHERE app_id = $1
`

func (q *Queries) GetTagsByApp(ctx context.Context, appID uuid.UUID) ([]Tag, error) {
	rows, err := q.db.QueryContext(ctx, getTagsByApp, appID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Tag
	for rows.Next() {
		var i Tag
		if err := rows.Scan(
			&i.ID,
			&i.Title,
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

const updateTag = `-- name: UpdateTag :one
UPDATE tags
SET title = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, title, app_id, created_at, updated_at
`

type UpdateTagParams struct {
	Title string
	ID    uuid.UUID
}

func (q *Queries) UpdateTag(ctx context.Context, arg UpdateTagParams) (Tag, error) {
	row := q.db.QueryRowContext(ctx, updateTag, arg.Title, arg.ID)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.AppID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
