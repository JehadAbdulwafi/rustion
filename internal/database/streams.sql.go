// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: streams.sql

package database

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const createStream = `-- name: CreateStream :exec
INSERT INTO streams (user_id, app, name, url, password, host, endpoint)
VALUES ($1, $2, $3, $4, $5, $6, $7)
`

type CreateStreamParams struct {
	UserID   uuid.UUID
	App      string
	Name     string
	Url      string
	Password string
	Host     string
	Endpoint string
}

func (q *Queries) CreateStream(ctx context.Context, arg CreateStreamParams) error {
	_, err := q.db.ExecContext(ctx, createStream,
		arg.UserID,
		arg.App,
		arg.Name,
		arg.Url,
		arg.Password,
		arg.Host,
		arg.Endpoint,
	)
	return err
}

const decrementStreamDailyViewers = `-- name: DecrementStreamDailyViewers :exec
UPDATE stream_viewers
SET viewer_count = GREATEST(viewer_count - 1, 0)
WHERE stream_id = $1 AND date = $2
`

type DecrementStreamDailyViewersParams struct {
	StreamID uuid.UUID
	Date     time.Time
}

func (q *Queries) DecrementStreamDailyViewers(ctx context.Context, arg DecrementStreamDailyViewersParams) error {
	_, err := q.db.ExecContext(ctx, decrementStreamDailyViewers, arg.StreamID, arg.Date)
	return err
}

const decrementStreamViewers = `-- name: DecrementStreamViewers :exec
UPDATE streams
SET viewers = viewers - 1
WHERE id = $1
`

func (q *Queries) DecrementStreamViewers(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, decrementStreamViewers, id)
	return err
}

const deleteStream = `-- name: DeleteStream :exec
DELETE FROM streams WHERE id = $1
`

func (q *Queries) DeleteStream(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteStream, id)
	return err
}

const getActiveStreams = `-- name: GetActiveStreams :many
SELECT id, user_id, app, name, endpoint, host, url, password, thumbnail, status, viewers, last_published_at, live_title, live_description, created_at, updated_at, last_checked_time FROM streams WHERE status = 'published'
`

func (q *Queries) GetActiveStreams(ctx context.Context) ([]Stream, error) {
	rows, err := q.db.QueryContext(ctx, getActiveStreams)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Stream
	for rows.Next() {
		var i Stream
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.App,
			&i.Name,
			&i.Endpoint,
			&i.Host,
			&i.Url,
			&i.Password,
			&i.Thumbnail,
			&i.Status,
			&i.Viewers,
			&i.LastPublishedAt,
			&i.LiveTitle,
			&i.LiveDescription,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.LastCheckedTime,
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

const getStream = `-- name: GetStream :one
SELECT id, user_id, app, name, url, status, viewers, thumbnail, live_title, live_description, last_published_at, last_checked_time FROM streams where id = $1
`

type GetStreamRow struct {
	ID              uuid.UUID
	UserID          uuid.UUID
	App             string
	Name            string
	Url             string
	Status          StreamStatusEnum
	Viewers         sql.NullInt32
	Thumbnail       sql.NullString
	LiveTitle       sql.NullString
	LiveDescription sql.NullString
	LastPublishedAt sql.NullTime
	LastCheckedTime time.Time
}

func (q *Queries) GetStream(ctx context.Context, id uuid.UUID) (GetStreamRow, error) {
	row := q.db.QueryRowContext(ctx, getStream, id)
	var i GetStreamRow
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.App,
		&i.Name,
		&i.Url,
		&i.Status,
		&i.Viewers,
		&i.Thumbnail,
		&i.LiveTitle,
		&i.LiveDescription,
		&i.LastPublishedAt,
		&i.LastCheckedTime,
	)
	return i, err
}

const getStreamByEndpoint = `-- name: GetStreamByEndpoint :one
SELECT id, user_id, app, name, endpoint, host, url, password, thumbnail, status, viewers, last_published_at, live_title, live_description, created_at, updated_at, last_checked_time FROM streams WHERE endpoint = $1
`

func (q *Queries) GetStreamByEndpoint(ctx context.Context, endpoint string) (Stream, error) {
	row := q.db.QueryRowContext(ctx, getStreamByEndpoint, endpoint)
	var i Stream
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.App,
		&i.Name,
		&i.Endpoint,
		&i.Host,
		&i.Url,
		&i.Password,
		&i.Thumbnail,
		&i.Status,
		&i.Viewers,
		&i.LastPublishedAt,
		&i.LiveTitle,
		&i.LiveDescription,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.LastCheckedTime,
	)
	return i, err
}

const getStreamById = `-- name: GetStreamById :one
SELECT id, user_id, app, name, endpoint, host, url, password, thumbnail, status, viewers, last_published_at, live_title, live_description, created_at, updated_at, last_checked_time FROM streams WHERE id = $1
`

func (q *Queries) GetStreamById(ctx context.Context, id uuid.UUID) (Stream, error) {
	row := q.db.QueryRowContext(ctx, getStreamById, id)
	var i Stream
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.App,
		&i.Name,
		&i.Endpoint,
		&i.Host,
		&i.Url,
		&i.Password,
		&i.Thumbnail,
		&i.Status,
		&i.Viewers,
		&i.LastPublishedAt,
		&i.LiveTitle,
		&i.LiveDescription,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.LastCheckedTime,
	)
	return i, err
}

const getStreamByStreamName = `-- name: GetStreamByStreamName :one
SELECT id, user_id, app, name, endpoint, host, url, password, thumbnail, status, viewers, last_published_at, live_title, live_description, created_at, updated_at, last_checked_time FROM streams WHERE name = $1
`

func (q *Queries) GetStreamByStreamName(ctx context.Context, name string) (Stream, error) {
	row := q.db.QueryRowContext(ctx, getStreamByStreamName, name)
	var i Stream
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.App,
		&i.Name,
		&i.Endpoint,
		&i.Host,
		&i.Url,
		&i.Password,
		&i.Thumbnail,
		&i.Status,
		&i.Viewers,
		&i.LastPublishedAt,
		&i.LiveTitle,
		&i.LiveDescription,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.LastCheckedTime,
	)
	return i, err
}

const getStreamByUserId = `-- name: GetStreamByUserId :one
SELECT id, user_id, app, name, endpoint, host, url, password, thumbnail, status, viewers, last_published_at, live_title, live_description, created_at, updated_at, last_checked_time FROM streams WHERE user_id = $1
`

func (q *Queries) GetStreamByUserId(ctx context.Context, userID uuid.UUID) (Stream, error) {
	row := q.db.QueryRowContext(ctx, getStreamByUserId, userID)
	var i Stream
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.App,
		&i.Name,
		&i.Endpoint,
		&i.Host,
		&i.Url,
		&i.Password,
		&i.Thumbnail,
		&i.Status,
		&i.Viewers,
		&i.LastPublishedAt,
		&i.LiveTitle,
		&i.LiveDescription,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.LastCheckedTime,
	)
	return i, err
}

const getStreamViewers = `-- name: GetStreamViewers :many
SELECT date, viewer_count 
FROM stream_viewers 
WHERE stream_id = $1
ORDER BY date DESC
`

type GetStreamViewersRow struct {
	Date        time.Time
	ViewerCount int32
}

func (q *Queries) GetStreamViewers(ctx context.Context, streamID uuid.UUID) ([]GetStreamViewersRow, error) {
	rows, err := q.db.QueryContext(ctx, getStreamViewers, streamID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetStreamViewersRow
	for rows.Next() {
		var i GetStreamViewersRow
		if err := rows.Scan(&i.Date, &i.ViewerCount); err != nil {
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

const getStreamViewersByDateRange = `-- name: GetStreamViewersByDateRange :many
SELECT date, viewer_count 
FROM stream_viewers 
WHERE stream_id = $1
    AND date BETWEEN $2 AND $3
ORDER BY date DESC
`

type GetStreamViewersByDateRangeParams struct {
	StreamID uuid.UUID
	Date     time.Time
	Date_2   time.Time
}

type GetStreamViewersByDateRangeRow struct {
	Date        time.Time
	ViewerCount int32
}

func (q *Queries) GetStreamViewersByDateRange(ctx context.Context, arg GetStreamViewersByDateRangeParams) ([]GetStreamViewersByDateRangeRow, error) {
	rows, err := q.db.QueryContext(ctx, getStreamViewersByDateRange, arg.StreamID, arg.Date, arg.Date_2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetStreamViewersByDateRangeRow
	for rows.Next() {
		var i GetStreamViewersByDateRangeRow
		if err := rows.Scan(&i.Date, &i.ViewerCount); err != nil {
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

const getStreamViewersByUserID = `-- name: GetStreamViewersByUserID :many
SELECT s.name, sva.date, sva.viewer_count
FROM stream_viewers sva
JOIN streams s ON sva.stream_id = s.id
WHERE s.user_id = $1
ORDER BY sva.date DESC
`

type GetStreamViewersByUserIDRow struct {
	Name        string
	Date        time.Time
	ViewerCount int32
}

func (q *Queries) GetStreamViewersByUserID(ctx context.Context, userID uuid.UUID) ([]GetStreamViewersByUserIDRow, error) {
	rows, err := q.db.QueryContext(ctx, getStreamViewersByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetStreamViewersByUserIDRow
	for rows.Next() {
		var i GetStreamViewersByUserIDRow
		if err := rows.Scan(&i.Name, &i.Date, &i.ViewerCount); err != nil {
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

const getStreamViewersByUserIDAndDateRange = `-- name: GetStreamViewersByUserIDAndDateRange :many
SELECT s.name, sva.date, sva.viewer_count
FROM stream_viewers sva
JOIN streams s ON sva.stream_id = s.id
WHERE s.user_id = $1
    AND sva.date BETWEEN $2 AND $3
ORDER BY sva.date DESC
`

type GetStreamViewersByUserIDAndDateRangeParams struct {
	UserID uuid.UUID
	Date   time.Time
	Date_2 time.Time
}

type GetStreamViewersByUserIDAndDateRangeRow struct {
	Name        string
	Date        time.Time
	ViewerCount int32
}

func (q *Queries) GetStreamViewersByUserIDAndDateRange(ctx context.Context, arg GetStreamViewersByUserIDAndDateRangeParams) ([]GetStreamViewersByUserIDAndDateRangeRow, error) {
	rows, err := q.db.QueryContext(ctx, getStreamViewersByUserIDAndDateRange, arg.UserID, arg.Date, arg.Date_2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetStreamViewersByUserIDAndDateRangeRow
	for rows.Next() {
		var i GetStreamViewersByUserIDAndDateRangeRow
		if err := rows.Scan(&i.Name, &i.Date, &i.ViewerCount); err != nil {
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

const getStreams = `-- name: GetStreams :many
SELECT id, user_id, app, name, url, status, viewers, thumbnail, last_published_at FROM streams
`

type GetStreamsRow struct {
	ID              uuid.UUID
	UserID          uuid.UUID
	App             string
	Name            string
	Url             string
	Status          StreamStatusEnum
	Viewers         sql.NullInt32
	Thumbnail       sql.NullString
	LastPublishedAt sql.NullTime
}

func (q *Queries) GetStreams(ctx context.Context) ([]GetStreamsRow, error) {
	rows, err := q.db.QueryContext(ctx, getStreams)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetStreamsRow
	for rows.Next() {
		var i GetStreamsRow
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.App,
			&i.Name,
			&i.Url,
			&i.Status,
			&i.Viewers,
			&i.Thumbnail,
			&i.LastPublishedAt,
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

const getStreamsByUserId = `-- name: GetStreamsByUserId :many
SELECT id, user_id, app, name, url, status, viewers, thumbnail, last_published_at FROM streams WHERE user_id = $1
`

type GetStreamsByUserIdRow struct {
	ID              uuid.UUID
	UserID          uuid.UUID
	App             string
	Name            string
	Url             string
	Status          StreamStatusEnum
	Viewers         sql.NullInt32
	Thumbnail       sql.NullString
	LastPublishedAt sql.NullTime
}

func (q *Queries) GetStreamsByUserId(ctx context.Context, userID uuid.UUID) ([]GetStreamsByUserIdRow, error) {
	rows, err := q.db.QueryContext(ctx, getStreamsByUserId, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetStreamsByUserIdRow
	for rows.Next() {
		var i GetStreamsByUserIdRow
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.App,
			&i.Name,
			&i.Url,
			&i.Status,
			&i.Viewers,
			&i.Thumbnail,
			&i.LastPublishedAt,
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

const incrementStreamDailyViewers = `-- name: IncrementStreamDailyViewers :exec
INSERT INTO stream_viewers (stream_id, date, viewer_count)
VALUES ($1, $2, 1)
ON CONFLICT (stream_id, date)
DO UPDATE SET
  viewer_count = stream_viewers.viewer_count + 1
`

type IncrementStreamDailyViewersParams struct {
	StreamID uuid.UUID
	Date     time.Time
}

func (q *Queries) IncrementStreamDailyViewers(ctx context.Context, arg IncrementStreamDailyViewersParams) error {
	_, err := q.db.ExecContext(ctx, incrementStreamDailyViewers, arg.StreamID, arg.Date)
	return err
}

const incrementStreamViewers = `-- name: IncrementStreamViewers :exec
UPDATE streams
SET viewers = viewers + 1
WHERE id = $1
`

func (q *Queries) IncrementStreamViewers(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, incrementStreamViewers, id)
	return err
}

const publishStream = `-- name: PublishStream :exec
UPDATE streams
SET status = 'published', last_published_at = CURRENT_TIMESTAMP, last_checked_time = CURRENT_TIMESTAMP
WHERE id = $1
`

func (q *Queries) PublishStream(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, publishStream, id)
	return err
}

const unpublishStream = `-- name: UnpublishStream :exec
UPDATE streams
SET status = 'unpublished', last_published_at = CURRENT_TIMESTAMP, last_checked_time = CURRENT_TIMESTAMP
WHERE id = $1
`

func (q *Queries) UnpublishStream(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, unpublishStream, id)
	return err
}

const updateStream = `-- name: UpdateStream :exec
UPDATE streams
SET app = $2, name = $3, url = $4, password = $5, host = $6, endpoint = $7, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
`

type UpdateStreamParams struct {
	ID       uuid.UUID
	App      string
	Name     string
	Url      string
	Password string
	Host     string
	Endpoint string
}

func (q *Queries) UpdateStream(ctx context.Context, arg UpdateStreamParams) error {
	_, err := q.db.ExecContext(ctx, updateStream,
		arg.ID,
		arg.App,
		arg.Name,
		arg.Url,
		arg.Password,
		arg.Host,
		arg.Endpoint,
	)
	return err
}

const updateStreamCheckTime = `-- name: UpdateStreamCheckTime :exec
UPDATE streams 
SET last_checked_time = $2 
WHERE id = $1
`

type UpdateStreamCheckTimeParams struct {
	ID              uuid.UUID
	LastCheckedTime time.Time
}

func (q *Queries) UpdateStreamCheckTime(ctx context.Context, arg UpdateStreamCheckTimeParams) error {
	_, err := q.db.ExecContext(ctx, updateStreamCheckTime, arg.ID, arg.LastCheckedTime)
	return err
}

const updateStreamInfo = `-- name: UpdateStreamInfo :one
UPDATE streams
SET live_title = $2, live_description = $3, thumbnail = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING id, user_id, app, name, endpoint, host, url, password, thumbnail, status, viewers, last_published_at, live_title, live_description, created_at, updated_at, last_checked_time
`

type UpdateStreamInfoParams struct {
	ID              uuid.UUID
	LiveTitle       sql.NullString
	LiveDescription sql.NullString
	Thumbnail       sql.NullString
}

func (q *Queries) UpdateStreamInfo(ctx context.Context, arg UpdateStreamInfoParams) (Stream, error) {
	row := q.db.QueryRowContext(ctx, updateStreamInfo,
		arg.ID,
		arg.LiveTitle,
		arg.LiveDescription,
		arg.Thumbnail,
	)
	var i Stream
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.App,
		&i.Name,
		&i.Endpoint,
		&i.Host,
		&i.Url,
		&i.Password,
		&i.Thumbnail,
		&i.Status,
		&i.Viewers,
		&i.LastPublishedAt,
		&i.LiveTitle,
		&i.LiveDescription,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.LastCheckedTime,
	)
	return i, err
}

const updateStreamName = `-- name: UpdateStreamName :exec
UPDATE streams
SET name = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
`

type UpdateStreamNameParams struct {
	ID   uuid.UUID
	Name string
}

func (q *Queries) UpdateStreamName(ctx context.Context, arg UpdateStreamNameParams) error {
	_, err := q.db.ExecContext(ctx, updateStreamName, arg.ID, arg.Name)
	return err
}

const updateStreamPassword = `-- name: UpdateStreamPassword :exec
UPDATE streams
SET password = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
`

type UpdateStreamPasswordParams struct {
	ID       uuid.UUID
	Password string
}

func (q *Queries) UpdateStreamPassword(ctx context.Context, arg UpdateStreamPasswordParams) error {
	_, err := q.db.ExecContext(ctx, updateStreamPassword, arg.ID, arg.Password)
	return err
}

const updateStreamViewers = `-- name: UpdateStreamViewers :exec
UPDATE streams
SET viewers = $2
WHERE id = $1
`

type UpdateStreamViewersParams struct {
	ID      uuid.UUID
	Viewers sql.NullInt32
}

func (q *Queries) UpdateStreamViewers(ctx context.Context, arg UpdateStreamViewersParams) error {
	_, err := q.db.ExecContext(ctx, updateStreamViewers, arg.ID, arg.Viewers)
	return err
}
