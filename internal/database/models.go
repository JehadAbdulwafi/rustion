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
)

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
	StreamStatusEnumOnline    StreamStatusEnum = "online"
	StreamStatusEnumOffline   StreamStatusEnum = "offline"
	StreamStatusEnumScheduled StreamStatusEnum = "scheduled"
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

type PasswordResetToken struct {
	Token      uuid.UUID
	ValidUntil time.Time
	UserID     uuid.UUID
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type PushToken struct {
	ID        uuid.UUID
	Token     string
	Provider  ProviderType
	UserID    uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Stream struct {
	ID         uuid.UUID
	App        string
	StreamName string
	Url        string
	UserID     uuid.UUID
	CreatedAt  sql.NullTime
	UpdatedAt  sql.NullTime
}

type StreamDetail struct {
	ID          uuid.UUID
	StreamID    uuid.UUID
	Title       string
	Description string
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
}

type StreamStatus struct {
	ID              uuid.UUID
	StreamID        uuid.UUID
	Status          StreamStatusEnum
	EstStartTime    sql.NullTime
	LastPublishedAt sql.NullTime
	ViewersCount    sql.NullInt32
	CreatedAt       sql.NullTime
	UpdatedAt       sql.NullTime
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
