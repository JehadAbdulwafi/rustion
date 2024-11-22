-- name: CreateTVShow :one
INSERT INTO tv_shows (title, genre, description, image, app_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetTVShowByID :one
SELECT * FROM tv_shows WHERE id = $1;

-- name: GetAllTVShows :many
SELECT * FROM tv_shows WHERE app_id = $1;

-- name: UpdateTVShow :one
UPDATE tv_shows
SET title = $2, genre = $3, description = $4, image = $5, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteTVShow :exec
DELETE FROM tv_shows WHERE id = $1;

-- name: GetTVShowSchedulesByTVShowID :many
SELECT * FROM tv_show_schedules WHERE tv_show_id = $1;

-- name: UpdateTVShowSchedule :exec
UPDATE tv_show_schedules
SET time = $3, is_active = $4
WHERE tv_show_id = $1 AND day = $2;
