// Code generated by go-swagger; DO NOT EDIT.

package types

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// NewsArticle news article
//
// swagger:model newsArticle
type NewsArticle struct {

	// ID of the category the news article belongs to
	// Example: 2
	// Required: true
	CategoryID *int64 `json:"category_id"`

	// Content of the news article
	// Example: This is the content of the news article.
	// Required: true
	Content *string `json:"content"`

	// Timestamp when the article was created
	// Example: 2023-10-01T12:00:00Z
	// Format: date-time
	CreatedAt strfmt.DateTime `json:"created_at,omitempty"`

	// ID of the news article
	// Example: 1
	// Required: true
	ID *int64 `json:"id"`

	// Title of the news article
	// Example: Breaking News Title
	// Required: true
	// Max Length: 255
	Title *string `json:"title"`

	// Timestamp when the article was last updated
	// Example: 2023-10-02T12:00:00Z
	// Format: date-time
	UpdatedAt strfmt.DateTime `json:"updated_at,omitempty"`
}

// Validate validates this news article
func (m *NewsArticle) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCategoryID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateContent(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateCreatedAt(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTitle(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateUpdatedAt(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *NewsArticle) validateCategoryID(formats strfmt.Registry) error {

	if err := validate.Required("category_id", "body", m.CategoryID); err != nil {
		return err
	}

	return nil
}

func (m *NewsArticle) validateContent(formats strfmt.Registry) error {

	if err := validate.Required("content", "body", m.Content); err != nil {
		return err
	}

	return nil
}

func (m *NewsArticle) validateCreatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.CreatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("created_at", "body", "date-time", m.CreatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *NewsArticle) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	return nil
}

func (m *NewsArticle) validateTitle(formats strfmt.Registry) error {

	if err := validate.Required("title", "body", m.Title); err != nil {
		return err
	}

	if err := validate.MaxLength("title", "body", *m.Title, 255); err != nil {
		return err
	}

	return nil
}

func (m *NewsArticle) validateUpdatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.UpdatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("updated_at", "body", "date-time", m.UpdatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this news article based on context it is used
func (m *NewsArticle) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *NewsArticle) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *NewsArticle) UnmarshalBinary(b []byte) error {
	var res NewsArticle
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
