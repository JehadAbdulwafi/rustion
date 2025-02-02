-- name: CreateEmailVerificationToken :one
INSERT INTO email_verification_tokens (user_id)
VALUES ($1)
RETURNING *;

-- name: GetEmailVerificationToken :one
SELECT *
FROM email_verification_tokens
WHERE token = $1;

-- name: DeleteEmailVerificationToken :exec
DELETE FROM email_verification_tokens
WHERE token = $1;

-- name: DeleteEmailVerificationTokensByUserID :exec
DELETE FROM email_verification_tokens
WHERE user_id = $1;
