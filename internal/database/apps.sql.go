// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: apps.sql

package database

import (
	"context"

	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

const createApp = `-- name: CreateApp :one
INSERT INTO apps (user_id, name, config)
VALUES ($1, $2, $3)
RETURNING id, user_id, name, config, created_at, updated_at
`

type CreateAppParams struct {
	UserID uuid.UUID
	Name   string
	Config pqtype.NullRawMessage
}

func (q *Queries) CreateApp(ctx context.Context, arg CreateAppParams) (App, error) {
	row := q.db.QueryRowContext(ctx, createApp, arg.UserID, arg.Name, arg.Config)
	var i App
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Config,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteApp = `-- name: DeleteApp :exec
DELETE FROM apps
WHERE id = $1
`

func (q *Queries) DeleteApp(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteApp, id)
	return err
}

const getApp = `-- name: GetApp :one
SELECT id, user_id, name, config, created_at, updated_at
FROM apps
WHERE id = $1
`

func (q *Queries) GetApp(ctx context.Context, id uuid.UUID) (App, error) {
	row := q.db.QueryRowContext(ctx, getApp, id)
	var i App
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Config,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getAppByUserID = `-- name: GetAppByUserID :one
SELECT id, user_id, name, config, created_at, updated_at
FROM apps
WHERE user_id = $1
LIMIT 1
`

func (q *Queries) GetAppByUserID(ctx context.Context, userID uuid.UUID) (App, error) {
	row := q.db.QueryRowContext(ctx, getAppByUserID, userID)
	var i App
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Config,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getApps = `-- name: GetApps :many
SELECT id, user_id, name, config, created_at, updated_at FROM apps
`

func (q *Queries) GetApps(ctx context.Context) ([]App, error) {
	rows, err := q.db.QueryContext(ctx, getApps)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []App
	for rows.Next() {
		var i App
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Name,
			&i.Config,
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

const getAppsByUserID = `-- name: GetAppsByUserID :many
SELECT id, user_id, name, config, created_at, updated_at FROM apps
WHERE user_id = $1
`

func (q *Queries) GetAppsByUserID(ctx context.Context, userID uuid.UUID) ([]App, error) {
	rows, err := q.db.QueryContext(ctx, getAppsByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []App
	for rows.Next() {
		var i App
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Name,
			&i.Config,
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

const updateApp = `-- name: UpdateApp :one
UPDATE apps
SET name = $1, config = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING id, user_id, name, config, created_at, updated_at
`

type UpdateAppParams struct {
	Name   string
	Config pqtype.NullRawMessage
	ID     uuid.UUID
}

func (q *Queries) UpdateApp(ctx context.Context, arg UpdateAppParams) (App, error) {
	row := q.db.QueryRowContext(ctx, updateApp, arg.Name, arg.Config, arg.ID)
	var i App
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Config,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
