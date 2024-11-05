-- name: CreateTVShow :one
INSERT INTO tv_shows (title, genre, description)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetTVShowByID :one
SELECT * FROM tv_shows WHERE id = $1;

-- name: GetAllTVShows :many
SELECT * FROM tv_shows;

-- name: UpdateTVShow :one
UPDATE tv_shows
SET title = $2, genre = $3, description = $4, updated_at = CURRENT_TIMESTAMP
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