-- name: CreateUser :one
INSERT INTO users (
  name, email, password
) VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;
