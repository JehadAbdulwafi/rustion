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
	Stream1                *database.Stream
	StreamStatus1          *database.StreamStatus
	Stream2                *database.Stream
	StreamStatus2          *database.StreamStatus
	Stream3                *database.Stream
	StreamStatus3          *database.StreamStatus
	Article1               *database.Article
	Article2               *database.Article
	Article3               *database.Article
	Article4               *database.Article
	Article5               *database.Article
	Article6               *database.Article
	Category1              *database.Category
	Category2              *database.Category
	Category3              *database.Category
	FeaturedSection1       *database.FeaturedSection
	FeaturedSection2       *database.FeaturedSection
	FeaturedSection3       *database.FeaturedSection
	FeaturedArticle1       *database.FeaturedArticle
	FeaturedArticle2       *database.FeaturedArticle
	FeaturedArticle3       *database.FeaturedArticle
	FeaturedArticle4       *database.FeaturedArticle
	FeaturedArticle5       *database.FeaturedArticle
	FeaturedArticle6       *database.FeaturedArticle
}

// Fixtures returns a function wrapping our fixtures, which tests are allowed to manipulate.
func Fixtures() FixtureMap {
	now := time.Now()
	f := FixtureMap{}

	categoryID1 := uuid.New()
	categoryID2 := uuid.New()
	categoryID3 := uuid.New()

	featuredSectionID1 := uuid.New()
	featuredSectionID2 := uuid.New()
	featuredSectionID3 := uuid.New()

	articleID1 := uuid.New()
	articleID2 := uuid.New()
	articleID3 := uuid.New()
	articleID4 := uuid.New()
	articleID5 := uuid.New()
	articleID6 := uuid.New()

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

	f.Stream1 = &database.Stream{
		ID:         uuid.MustParse("8f866d1a-a9ae-4bf1-8198-0fbd2646a7c4"),
		App:        "live",
		StreamName: "cFwLFDa329",
		Url:        "http://localhost:2022/live/cFwLFDa329",
		UserID:     uuid.MustParse("6c46cdec-4fd3-4d25-8218-3b75df65f8ab"),
	}

	f.StreamStatus1 = &database.StreamStatus{
		ID:           uuid.New(),
		StreamID:     f.Stream1.ID,
		Status:       "online",
		EstStartTime: sql.NullTime{},
		LastPublishedAt: sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		},
		ViewersCount: sql.NullInt32{},
		CreatedAt:    sql.NullTime{},
		UpdatedAt:    sql.NullTime{},
	}

	f.Stream2 = &database.Stream{
		ID:         uuid.MustParse("e4762503-d387-48d6-b417-283cd14ebaf0"),
		App:        "live",
		StreamName: "y6N3dLPYtx",
		Url:        "http://localhost:2022/live/y6N3dLPYtx",
		UserID:     uuid.MustParse("bafe468f-f756-499e-bd95-9a2980fd164e"),
	}

	f.StreamStatus2 = &database.StreamStatus{
		ID:           uuid.New(),
		StreamID:     f.Stream2.ID,
		Status:       "offline",
		EstStartTime: sql.NullTime{},
		LastPublishedAt: sql.NullTime{
			Time:  time.Now().AddDate(0, 0, -7),
			Valid: true,
		},
		ViewersCount: sql.NullInt32{},
		CreatedAt:    sql.NullTime{},
		UpdatedAt:    sql.NullTime{},
	}

	f.Stream3 = &database.Stream{
		ID:         uuid.MustParse("47658727-adbd-4e06-84ec-0ba2043973e5"),
		App:        "live",
		StreamName: "h2NSaFwRww",
		Url:        "http://localhost:2022/live/h2NSaFwRww",
		UserID:     uuid.MustParse("19211b77-c579-4e6e-95c1-35735fcaaae1"),
	}

	f.StreamStatus3 = &database.StreamStatus{
		ID:           uuid.New(),
		StreamID:     f.Stream3.ID,
		Status:       "offline",
		EstStartTime: sql.NullTime{},
		LastPublishedAt: sql.NullTime{
			Time:  time.Now().AddDate(0, 0, -7),
			Valid: true,
		},
		ViewersCount: sql.NullInt32{},
		CreatedAt:    sql.NullTime{},
		UpdatedAt:    sql.NullTime{},
	}

	f.Category1 = &database.Category{
		ID:    categoryID1,
		Title: "Category Title",
	}

	f.Category2 = &database.Category{
		ID:    categoryID2,
		Title: "Category Title",
	}

	f.Category3 = &database.Category{
		ID:    categoryID3,
		Title: "Category Title",
	}

	f.FeaturedSection1 = &database.FeaturedSection{
		ID:    featuredSectionID1,
		Title: "Latest Articles",
	}

	f.FeaturedSection2 = &database.FeaturedSection{
		ID:    featuredSectionID2,
		Title: "Trending Articles",
	}

	f.FeaturedSection3 = &database.FeaturedSection{
		ID:    featuredSectionID3,
		Title: "Popular Articles",
	}

	f.Article1 = &database.Article{
		ID:      articleID1,
		Title:   "Article Title",
		Content: "Article Content",
		CategoryID: uuid.NullUUID{
			UUID:  categoryID1,
			Valid: true,
		},
		Description: sql.NullString{
			String: "Article Description",
			Valid:  true,
		},
		Image: "https://th.bing.com/th/id/OIP.EKxkhulCPo2M5eP6LEOAHAHaLL",
	}

	f.Article2 = &database.Article{
		ID:      articleID2,
		Title:   "Article Title",
		Content: "Article Content",
		CategoryID: uuid.NullUUID{
			UUID:  categoryID1,
			Valid: true,
		},
		Description: sql.NullString{
			String: "Article Description",
			Valid:  true,
		},
		Image: "https://i.pinimg.com/736x/79/84/2f/79842f01e8b3773916823961d6650605.jpg",
	}

	f.Article3 = &database.Article{
		ID:      articleID3,
		Title:   "Article Title",
		Content: "Article Content",
		CategoryID: uuid.NullUUID{
			UUID:  categoryID2,
			Valid: true,
		},
		Description: sql.NullString{
			String: "Article Description",
			Valid:  true,
		},
		Image: "https://th.bing.com/th/id/OIP.QatFnF9HviYeE96kGdCpZgHaLH",
	}

	f.Article4 = &database.Article{
		ID:      articleID4,
		Title:   "Article Title",
		Content: "Article Content",
		CategoryID: uuid.NullUUID{
			UUID:  categoryID2,
			Valid: true,
		},
		Description: sql.NullString{
			String: "Article Description",
			Valid:  true,
		},
		Image: "https://th.bing.com/th/id/OIP.yIEB-Z7KC38rkAwXNZxv5QHaLG",
	}

	f.Article5 = &database.Article{
		ID:      articleID5,
		Title:   "Article Title",
		Content: "Article Content",
		CategoryID: uuid.NullUUID{
			UUID:  categoryID3,
			Valid: true,
		},
		Description: sql.NullString{
			String: "Article Description",
			Valid:  true,
		},
		Image: "https://th.bing.com/th/id/OIP.HEWc4UQg4s-gNFlFgRxCBQHaLG",
	}

	f.Article6 = &database.Article{
		ID:      articleID6,
		Title:   "Article Title",
		Content: "Article Content",
		CategoryID: uuid.NullUUID{
			UUID:  categoryID3,
			Valid: true,
		},
		Description: sql.NullString{
			String: "Article Description",
			Valid:  true,
		},
		Image: "https://th.bing.com/th/id/OIP._Fxv7pChiqxvz4QLubEXJgHaLH",
	}

	f.FeaturedArticle1 = &database.FeaturedArticle{
		ID:                uuid.New(),
		ArticleID:         articleID1,
		FeaturedSectionID: featuredSectionID1,
	}

	f.FeaturedArticle2 = &database.FeaturedArticle{
		ID:                uuid.New(),
		ArticleID:         articleID2,
		FeaturedSectionID: featuredSectionID1,
	}

	f.FeaturedArticle3 = &database.FeaturedArticle{
		ID:                uuid.New(),
		ArticleID:         articleID3,
		FeaturedSectionID: featuredSectionID2,
	}

	f.FeaturedArticle4 = &database.FeaturedArticle{
		ID:                uuid.New(),
		ArticleID:         articleID4,
		FeaturedSectionID: featuredSectionID2,
	}

	f.FeaturedArticle5 = &database.FeaturedArticle{
		ID:                uuid.New(),
		ArticleID:         articleID5,
		FeaturedSectionID: featuredSectionID3,
	}

	f.FeaturedArticle6 = &database.FeaturedArticle{
		ID:                uuid.New(),
		ArticleID:         articleID6,
		FeaturedSectionID: featuredSectionID3,
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

	inserts = append(inserts, fix.Stream1)
	inserts = append(inserts, fix.StreamStatus1)
	inserts = append(inserts, fix.Stream2)
	inserts = append(inserts, fix.StreamStatus2)
	inserts = append(inserts, fix.Stream3)
	inserts = append(inserts, fix.StreamStatus3)

	inserts = append(inserts, fix.Category1)
	inserts = append(inserts, fix.Category2)
	inserts = append(inserts, fix.Category3)

	inserts = append(inserts, fix.FeaturedSection1)
	inserts = append(inserts, fix.FeaturedSection2)
	inserts = append(inserts, fix.FeaturedSection3)

	inserts = append(inserts, fix.Article1)
	inserts = append(inserts, fix.Article2)
	inserts = append(inserts, fix.Article3)
	inserts = append(inserts, fix.Article4)
	inserts = append(inserts, fix.Article5)
	inserts = append(inserts, fix.Article6)

	inserts = append(inserts, fix.FeaturedArticle1)
	inserts = append(inserts, fix.FeaturedArticle2)
	inserts = append(inserts, fix.FeaturedArticle3)
	inserts = append(inserts, fix.FeaturedArticle4)
	inserts = append(inserts, fix.FeaturedArticle5)
	inserts = append(inserts, fix.FeaturedArticle6)

	log.Debug().Int("count", len(inserts)).Msg("Number of insertable fixtures found")

	return inserts
}
