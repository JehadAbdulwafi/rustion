package test

import (
	"database/sql"
	"time"

	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

const (
	PlainTestUserPassword  = "password"
	HashedTestUserPassword = "$argon2id$v=19$m=65536,t=1,p=4$RFO8ulg2c2zloG0029pAUQ$2Po6NUIhVCMm9vivVDuzo7k5KVWfZzJJfeXzC+n+row" //nolint:gosec
)

type Insertable interface{}

type FixtureMap struct {
	User1                  *database.User
	User1Account           *database.Account
	User2                  *database.User
	User2Account           *database.Account
	UserDeactivated        *database.User
	UserDeactivatedAccount *database.Account
}

// Fixtures returns a function wrapping our fixtures, which tests are allowed to manipulate.
func Fixtures() FixtureMap {
	now := time.Now()
	f := FixtureMap{}

	f.User1 = &database.User{
		ID:         uuid.MustParse("6c46cdec-4fd3-4d25-8218-3b75df65f8ab"),
		IsActive:   true,
		IsVerified: true,
		Name:       "user1",
		Email:      "user1@gmail.com",
		Password:   HashedTestUserPassword,
	}

	f.User1Account = &database.Account{
		ID:                int32(1),
		UserID:            f.User1.ID,
		Provider:          "rustion",
		ProviderAccountID: f.User1.ID.String(),
		AccessToken: sql.NullString{
			Valid:  true,
			String: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjdXN0b21lciIsImV4cCI6ODY0MDAwMDAwMDAwMDAsImlhdCI6MTcyOTg5NTI0NCwiaXNzIjoicnVzdGlvbiIsInN1YiI6InVzZXIxQGdtYWlsLmNvbSJ9.OrUpaWVTpsp6ofPxb_j27hNi2PAXRvmuOexUkuQ9cqA",
		},
		RefreshToken: sql.NullString{
			Valid:  true,
			String: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjdXN0b21lciIsImV4cCI6NjA0ODAwMDAwMDAwMDAwLCJpYXQiOjE3Mjk4OTUyNDQsImlzcyI6InJ1c3Rpb24iLCJzdWIiOiJ1c2VyMUBnbWFpbC5jb20ifQ.eRkcVty42BUze_4mhLYWtP8hxFP7IL-9BbU4y3akdBk",
		},
		ValidUntil: now.Add(10 * 365 * 24 * time.Hour),
		TokenType: sql.NullString{
			String: "bearer",
			Valid:  true,
		},
	}

	f.User2 = &database.User{
		ID:       uuid.MustParse("bafe468f-f756-499e-bd95-9a2980fd164e"),
		IsActive: true,
		Email:    "user2@gmail.com",
		Name:     "user2",
		Password: HashedTestUserPassword,
	}

	f.User2Account = &database.Account{
		ID:                int32(2),
		UserID:            f.User2.ID,
		ProviderAccountID: f.User2.ID.String(),
		ValidUntil:        now.Add(time.Minute * -10),
		Provider:          "rustion",
		AccessToken: sql.NullString{
			Valid:  true,
			String: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjdXN0b21lciIsImV4cCI6ODY0MDAwMDAwMDAwMDAsImlhdCI6MTcyOTg5NTQyMiwiaXNzIjoicnVzdGlvbiIsInN1YiI6InVzZXIyQGdtYWlsLmNvbSJ9.gdytDsyBPU-RWR674_fVL0PME2HHEvYQ3z6CToYHi6A",
		},
		RefreshToken: sql.NullString{
			Valid:  true,
			String: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjdXN0b21lciIsImV4cCI6ODY0MDAwMDAwMDAwMDAsImlhdCI6MTcyOTg5NTQyMiwiaXNzIjoicnVzdGlvbiIsInN1YiI6InVzZXIyQGdtYWlsLmNvbSJ9.gdytDsyBPU-RWR674_fVL0PME2HHEvYQ3z6CToYHi6A",
		},
		TokenType: sql.NullString{
			String: "bearer",
			Valid:  true,
		},
	}

	f.UserDeactivated = &database.User{
		ID:       uuid.MustParse("19211b77-c579-4e6e-95c1-35735fcaaae1"),
		IsActive: false,
		Name:     "User Deactivated",
		Email:    "userdeactivated@gmail.com",
		Password: HashedTestUserPassword,
	}

	f.UserDeactivatedAccount = &database.Account{
		ID:                int32(3),
		UserID:            f.UserDeactivated.ID,
		ProviderAccountID: f.UserDeactivated.ID.String(),
		ValidUntil:        time.Time{},
		Provider:          "rustion",
		AccessToken: sql.NullString{
			Valid:  true,
			String: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjdXN0b21lciIsImV4cCI6ODY0MDAwMDAwMDAwMDAsImlhdCI6MTcyOTg5NTUyMiwiaXNzIjoicnVzdGlvbiIsInN1YiI6InVzZXJkZWFjdGl2YXRlZEBnbWFpbC5jb20ifQ.Dqh5VgzRr_H1aRxNLpRfaNzmISshhuEgmci7a4oa4Vo",
		},
		RefreshToken: sql.NullString{
			Valid:  true,
			String: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjdXN0b21lciIsImV4cCI6NjA0ODAwMDAwMDAwMDAwLCJpYXQiOjE3Mjk4OTU1MjIsImlzcyI6InJ1c3Rpb24iLCJzdWIiOiJ1c2VyZGVhY3RpdmF0ZWRAZ21haWwuY29tIn0.OWp9ll1_Z4IFsxcNlDLlqMlFtF6g_vGObhECrEXaD-k",
		},
		TokenType: sql.NullString{
			String: "bearer",
			Valid:  true,
		},
	}

	return f
}

// Inserts defines the order in which the fixtures will be inserted
// into the test database
func Inserts() []Insertable {
	fix := Fixtures()

	var inserts []Insertable

	inserts = append(inserts, fix.User1)
	inserts = append(inserts, fix.User1Account)
	inserts = append(inserts, fix.User2)
	inserts = append(inserts, fix.User2Account)
	inserts = append(inserts, fix.UserDeactivated)
	inserts = append(inserts, fix.UserDeactivatedAccount)

	log.Debug().Int("count", len(inserts)).Msg("Number of insertable fixtures found")

	return inserts
}
