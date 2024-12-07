-- name: CreateUser :one
INSERT INTO users (
  name, email, password
) VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: CheckUserExists :one
SELECT EXISTS (SELECT 1 FROM users WHERE email = $1);

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: UpdateUserInfo :exec
UPDATE users
SET name = $2, email = $3
WHERE id = $1;

-- name: UpdateUserPassword :one
UPDATE users
SET password = $2
WHERE id = $1
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;
