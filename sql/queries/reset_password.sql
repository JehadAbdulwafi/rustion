-- name: CreateResetPasswordToken :one
INSERT INTO password_reset_tokens (user_id, valid_until)
VALUES ($1, $2)
RETURNING *;

-- name: GetResetPasswordToken :one
SELECT * FROM password_reset_tokens WHERE token = $1;

-- name: GetResetPasswordTokenByUser :one
SELECT * FROM password_reset_tokens WHERE user_id = $1;

-- name: GetUserResetPasswordToken :one
SELECT * FROM password_reset_tokens
WHERE created_at > $2
AND valid_until > NOW()
AND user_id = $1;

-- name: DeleteResetPasswordToken :exec
DELETE FROM password_reset_tokens WHERE token = $1;

