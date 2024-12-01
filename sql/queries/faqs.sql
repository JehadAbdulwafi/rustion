-- name: CreateFAQ :one
INSERT INTO faqs (question, answer, updated_at)
VALUES ($1, $2, CURRENT_TIMESTAMP)
RETURNING *;

-- name: GetFAQ :one
SELECT * FROM faqs WHERE id = $1;

-- name: GetFAQs :many
SELECT * FROM faqs;

-- name: UpdateFAQ :one
UPDATE faqs
SET question = $2, answer = $3, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteFAQ :exec
DELETE FROM faqs WHERE id = $1;