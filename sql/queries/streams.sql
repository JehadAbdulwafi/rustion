-- name: CreateStream :exec
INSERT INTO streams (user_id, app, name, url, password, host, endpoint)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetStreamById :one
SELECT * FROM streams WHERE id = $1;

-- name: GetStream :one
SELECT id, user_id, app, name, url, status, viewers, thumbnail, live_title, live_description, last_published_at, last_checked_time FROM streams where id = $1;

-- name: GetStreams :many
SELECT id, user_id, app, name, url, status, viewers, thumbnail, last_published_at FROM streams;

-- name: GetStreamsByUserId :many
SELECT id, user_id, app, name, url, status, viewers, thumbnail, last_published_at FROM streams WHERE user_id = $1;

-- name: GetStreamByUserId :one
SELECT * FROM streams WHERE user_id = $1;

-- name: GetStreamByStreamName :one
SELECT * FROM streams WHERE name = $1;

-- name: GetStreamByEndpoint :one
SELECT * FROM streams WHERE endpoint = $1;

-- name: UpdateStream :exec
UPDATE streams
SET app = $2, name = $3, url = $4, password = $5, host = $6, endpoint = $7, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: UpdateStreamName :exec
UPDATE streams
SET name = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: UpdateStreamPassword :exec
UPDATE streams
SET password = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: DeleteStream :exec
DELETE FROM streams WHERE id = $1;

-- name: PublishStream :exec
UPDATE streams
SET status = 'published', last_published_at = CURRENT_TIMESTAMP, last_checked_time = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: UnpublishStream :exec
UPDATE streams
SET status = 'unpublished', last_published_at = CURRENT_TIMESTAMP, last_checked_time = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: UpdateStreamInfo :one
UPDATE streams
SET live_title = $2, live_description = $3, thumbnail = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: UpdateStreamViewers :exec
UPDATE streams
SET viewers = $2
WHERE id = $1;

-- name: IncrementStreamViewers :exec
UPDATE streams
SET viewers = viewers + 1
WHERE id = $1;

-- name: DecrementStreamViewers :exec
UPDATE streams
SET viewers = viewers - 1
WHERE id = $1;

-- name: GetActiveStreams :many
SELECT * FROM streams WHERE status = 'published';

-- name: UpdateStreamCheckTime :exec
UPDATE streams 
SET last_checked_time = $2 
WHERE id = $1;

-- name: IncrementStreamDailyViewers :exec
INSERT INTO stream_viewers (stream_id, date, viewer_count)
VALUES ($1, $2, 1)
ON CONFLICT (stream_id, date)
DO UPDATE SET
  viewer_count = stream_viewers.viewer_count + 1;

-- name: DecrementStreamDailyViewers :exec
UPDATE stream_viewers
SET viewer_count = GREATEST(viewer_count - 1, 0)
WHERE stream_id = $1 AND date = $2;

-- name: GetStreamViewersByDateRange :many
SELECT date, viewer_count 
FROM stream_viewers 
WHERE stream_id = $1
    AND date BETWEEN $2 AND $3
ORDER BY date DESC;

-- name: GetStreamViewers :many
SELECT date, viewer_count 
FROM stream_viewers 
WHERE stream_id = $1
ORDER BY date DESC;

-- name: GetStreamViewersByUserID :many
SELECT s.name, sva.date, sva.viewer_count
FROM stream_viewers sva
JOIN streams s ON sva.stream_id = s.id
WHERE s.user_id = $1
ORDER BY sva.date DESC;

-- name: GetStreamViewersByUserIDAndDateRange :many
SELECT s.name, sva.date, sva.viewer_count
FROM stream_viewers sva
JOIN streams s ON sva.stream_id = s.id
WHERE s.user_id = $1
    AND sva.date BETWEEN $2 AND $3
ORDER BY sva.date DESC;

