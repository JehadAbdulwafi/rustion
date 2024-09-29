-- name: CreateResetPasswordToken :one
INSERT INTO password_reset_tokens (user_id, valid_until)
VALUES ($1, $2)
RETURNING *;

-- name: GetResetPasswordToken :one
SELECT * FROM password_reset_tokens WHERE token = $1;

-- name: DeleteResetPasswordToken :exec
DELETE FROM password_reset_tokens WHERE token = $1;

