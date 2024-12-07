-- name: CreateStream :exec
INSERT INTO streams (user_id, app, name, url, password, host, endpoint)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetStreamById :one
SELECT * FROM streams WHERE id = $1;

-- name: GetStream :one
SELECT id, user_id, app, name, url, status, viewers, thumbnail, live_title, live_description, last_published_at FROM streams where id = $1;

-- name: GetStreams :many
SELECT id, user_id, app, name, url, status, viewers, thumbnail, last_published_at FROM streams;

-- name: GetStreamsByUserId :many
SELECT id, user_id, app, name, url, status, viewers, thumbnail, last_published_at FROM streams WHERE user_id = $1;

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
SET status = 'published', last_published_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: UnpublishStream :exec
UPDATE streams
SET status = 'unpublished', last_published_at = CURRENT_TIMESTAMP
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
