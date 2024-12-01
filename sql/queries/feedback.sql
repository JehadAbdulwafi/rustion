-- name: CreateFeedback :one
INSERT INTO feedbacks (subject, type, message, user_id, updated_at)
VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
RETURNING *;

-- name: GetFeedbacks :many
SELECT *
FROM feedbacks
ORDER BY created_at DESC;

-- name: GetFeedbacksByUserID :many
SELECT *
FROM feedbacks
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: DeleteFeedback :exec
DELETE FROM feedbacks
WHERE id = $1;

-- name: UpdateFeedback :one
UPDATE feedbacks
SET subject = $1, type = $2, message = $3, updated_at = CURRENT_TIMESTAMP
WHERE id = $4
RETURNING *;