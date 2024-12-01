// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package database

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

type DayEnum string

const (
	DayEnumMonday    DayEnum = "Monday"
	DayEnumTuesday   DayEnum = "Tuesday"
	DayEnumWednesday DayEnum = "Wednesday"
	DayEnumThursday  DayEnum = "Thursday"
	DayEnumFriday    DayEnum = "Friday"
	DayEnumSaturday  DayEnum = "Saturday"
	DayEnumSunday    DayEnum = "Sunday"
)

func (e *DayEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = DayEnum(s)
	case string:
		*e = DayEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for DayEnum: %T", src)
	}
	return nil
}

type NullDayEnum struct {
	DayEnum DayEnum
	Valid   bool // Valid is true if DayEnum is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullDayEnum) Scan(value interface{}) error {
	if value == nil {
		ns.DayEnum, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.DayEnum.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullDayEnum) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.DayEnum), nil
}

type FeedbackTypeEnum string

const (
	FeedbackTypeEnumSuggestion FeedbackTypeEnum = "suggestion"
	FeedbackTypeEnumBug        FeedbackTypeEnum = "bug"
	FeedbackTypeEnumGeneral    FeedbackTypeEnum = "general"
)

func (e *FeedbackTypeEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = FeedbackTypeEnum(s)
	case string:
		*e = FeedbackTypeEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for FeedbackTypeEnum: %T", src)
	}
	return nil
}

type NullFeedbackTypeEnum struct {
	FeedbackTypeEnum FeedbackTypeEnum
	Valid            bool // Valid is true if FeedbackTypeEnum is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullFeedbackTypeEnum) Scan(value interface{}) error {
	if value == nil {
		ns.FeedbackTypeEnum, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.FeedbackTypeEnum.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullFeedbackTypeEnum) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.FeedbackTypeEnum), nil
}

type ProviderType string

const (
	ProviderTypeFcm ProviderType = "fcm"
	ProviderTypeApn ProviderType = "apn"
)

func (e *ProviderType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ProviderType(s)
	case string:
		*e = ProviderType(s)
	default:
		return fmt.Errorf("unsupported scan type for ProviderType: %T", src)
	}
	return nil
}

type NullProviderType struct {
	ProviderType ProviderType
	Valid        bool // Valid is true if ProviderType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullProviderType) Scan(value interface{}) error {
	if value == nil {
		ns.ProviderType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.ProviderType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullProviderType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.ProviderType), nil
}

type StreamStatusEnum string

const (
	StreamStatusEnumPublished   StreamStatusEnum = "published"
	StreamStatusEnumUnpublished StreamStatusEnum = "unpublished"
)

func (e *StreamStatusEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = StreamStatusEnum(s)
	case string:
		*e = StreamStatusEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for StreamStatusEnum: %T", src)
	}
	return nil
}

type NullStreamStatusEnum struct {
	StreamStatusEnum StreamStatusEnum
	Valid            bool // Valid is true if StreamStatusEnum is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullStreamStatusEnum) Scan(value interface{}) error {
	if value == nil {
		ns.StreamStatusEnum, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.StreamStatusEnum.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullStreamStatusEnum) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.StreamStatusEnum), nil
}

type Account struct {
	ID                int32
	UserID            uuid.UUID
	Provider          string
	ProviderAccountID string
	RefreshToken      sql.NullString
	AccessToken       sql.NullString
	ValidUntil        time.Time
	Scope             sql.NullString
	TokenType         sql.NullString
}

type App struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	Name      string
	Config    pqtype.NullRawMessage
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type Article struct {
	ID          uuid.UUID
	Title       string
	Description sql.NullString
	Content     string
	Image       string
	Tags        sql.NullString
	AppID       uuid.UUID
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
}

type Faq struct {
	ID        uuid.UUID
	Question  string
	Answer    string
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type FeaturedArticle struct {
	ID                uuid.UUID
	FeaturedSectionID uuid.UUID
	ArticleID         uuid.UUID
	CreatedAt         sql.NullTime
	UpdatedAt         sql.NullTime
}

type FeaturedSection struct {
	ID        uuid.UUID
	Title     string
	AppID     uuid.UUID
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type Feedback struct {
	ID        uuid.UUID
	UserID    uuid.NullUUID
	Subject   string
	Type      FeedbackTypeEnum
	Message   string
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type PasswordResetToken struct {
	Token      uuid.UUID
	ValidUntil time.Time
	UserID     uuid.UUID
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type PushToken struct {
	ID          uuid.UUID
	Token       string
	Provider    ProviderType
	Fingerprint string
	AppID       uuid.NullUUID
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Stream struct {
	ID              uuid.UUID
	UserID          uuid.UUID
	App             string
	Name            string
	Url             string
	Password        string
	Thumbnail       sql.NullString
	Status          StreamStatusEnum
	Viewers         sql.NullInt32
	LastPublishedAt sql.NullTime
	LiveTitle       sql.NullString
	LiveDescription sql.NullString
	CreatedAt       sql.NullTime
	UpdatedAt       sql.NullTime
}

type Tag struct {
	ID        uuid.UUID
	Title     string
	AppID     uuid.UUID
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type TvShow struct {
	ID          uuid.UUID
	Title       string
	Genre       sql.NullString
	Description sql.NullString
	Image       sql.NullString
	AppID       uuid.UUID
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
}

type TvShowSchedule struct {
	ID       uuid.UUID
	TvShowID uuid.UUID
	Day      DayEnum
	Time     sql.NullTime
	IsActive bool
}

type User struct {
	ID          uuid.UUID
	Name        string
	Email       string
	Password    string
	IsVerified  bool
	IsActive    bool
	LastLoginAt sql.NullTime
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
}
