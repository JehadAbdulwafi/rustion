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

-- name: PublishStream :exec
UPDATE stream_metadata
SET status = 'published', last_published_at = CURRENT_TIMESTAMP
WHERE stream_id = $1;

-- name: UnpublishStream :exec
UPDATE stream_metadata
SET status = 'unpublished', last_published_at = CURRENT_TIMESTAMP
WHERE stream_id = $1;

-- name: CreateStreamMetadata :one
INSERT INTO stream_metadata (stream_id, title, description, thumbnail)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetStreamMetadata :one
SELECT * FROM stream_metadata WHERE stream_id = $1;

-- name: UpdateStreamMetadataInfo :one
UPDATE stream_metadata
SET title = $2, description = $3, updated_at = CURRENT_TIMESTAMP
WHERE stream_id = $1
RETURNING *;

-- name: UpdateStreamViewers :exec
UPDATE stream_metadata
SET viewers = $2
WHERE stream_id = $1;

-- name: IncrementStreamViewers :exec
UPDATE stream_metadata
SET viewers = viewers + 1
WHERE stream_id = $1;

-- name: DecrementStreamViewers :exec
UPDATE stream_metadata
SET viewers = viewers - 1
WHERE stream_id = $1;

-- name: DeleteStreamMetadata :exec
DELETE FROM stream_metadata WHERE stream_id = $1;