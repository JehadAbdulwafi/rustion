package auth

import (
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/database"
)

type AuthenticationResult struct {
	Token      string
	User       *database.User
	ValidUntil time.Time
}
