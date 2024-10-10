-- name: CreateStream :one
INSERT INTO streams (user_id, app, stream_name, url)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetStream :one
SELECT * FROM streams WHERE id = $1;

-- name: GetStreamsByUserId :many
SELECT * FROM streams WHERE user_id = $1;

-- name: GetStreamsByApp :many
SELECT * FROM streams WHERE app = $1;

-- name: GetStreamByStreamName :one
SELECT * FROM streams WHERE stream_name = $1;

-- name: UpdateStream :one
UPDATE streams
SET app = $2, stream_name = $3, url = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteStream :exec
DELETE FROM streams WHERE id = $1;

-- name: CreateStreamStatus :one
INSERT INTO stream_status (stream_id, status, est_start_time, last_published_at, viewers_count)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetStreamStatus :one
SELECT * FROM stream_status WHERE stream_id = $1;

-- name: UpdateStreamStatus :one
UPDATE stream_status
SET status = $2, est_start_time = $3, last_published_at = $4, viewers_count = $5
WHERE stream_id = $1
RETURNING *;

-- name: PublishStream :exec
UPDATE stream_status
SET status = 'online', last_published_at = CURRENT_TIMESTAMP
WHERE stream_id = $1;

-- name: UnpublishStream :exec
UPDATE stream_status
SET status = 'offline', last_published_at = CURRENT_TIMESTAMP
WHERE stream_id = $1;

-- name: ScheduleStream :exec
UPDATE stream_status
SET status = 'scheduled', est_start_time = $2
WHERE stream_id = $1;

-- name: UpdateStreamStatusViewersCount :exec
UPDATE stream_status
SET viewers_count = $2
WHERE stream_id = $1;

-- name: IncrementStreamStatusViewersCount :exec
UPDATE stream_status
SET viewers_count = viewers_count + 1
WHERE stream_id = $1;

-- name: DecrementStreamStatusViewersCount :exec
UPDATE stream_status
SET viewers_count = viewers_count - 1
WHERE stream_id = $1;

-- name: DeleteStreamStatus :exec
DELETE FROM stream_status WHERE stream_id = $1;

-- name: CreateStreamDetails :one
INSERT INTO stream_details (stream_id, title, description)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetStreamDetails :one
SELECT * FROM stream_details WHERE stream_id = $1;

-- name: UpdateStreamDetails :one
UPDATE stream_details
SET title = $2, description = $3, updated_at = CURRENT_TIMESTAMP
WHERE stream_id = $1
RETURNING *;

-- name: DeleteStreamDetails :exec
DELETE FROM stream_details WHERE stream_id = $1;