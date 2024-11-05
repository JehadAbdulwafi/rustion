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

// Article article
//
// swagger:model article
type Article struct {

	// Content of the article
	// Example: This is the content of the article.
	// Required: true
	Content *string `json:"content"`

	// Timestamp when the article was created
	// Example: 2023-10-01T12:00:00Z
	// Format: date-time
	CreatedAt strfmt.DateTime `json:"created_at,omitempty"`

	// Description of the article
	// Example: This is the description of the article.
	Description string `json:"description,omitempty"`

	// ID of article
	// Example: 82ebdfad-c586-4407-a873-4cc1c33d56fc
	// Required: true
	// Format: uuid4
	ID *strfmt.UUID4 `json:"id"`

	// Image of the article
	// Example: https://example.com/article-image.jpg
	// Required: true
	Image *string `json:"image"`

	// Content of the article
	// Example: tag1,tag2,tag3
	Tags string `json:"tags,omitempty"`

	// Title of the article
	// Example: Article Title
	// Required: true
	// Max Length: 255
	Title *string `json:"title"`

	// Timestamp when the article was last updated
	// Example: 2023-10-02T12:00:00Z
	// Format: date-time
	UpdatedAt strfmt.DateTime `json:"updated_at,omitempty"`
}

// Validate validates this article
func (m *Article) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateContent(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateCreatedAt(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateImage(formats); err != nil {
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

func (m *Article) validateContent(formats strfmt.Registry) error {

	if err := validate.Required("content", "body", m.Content); err != nil {
		return err
	}

	return nil
}

func (m *Article) validateCreatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.CreatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("created_at", "body", "date-time", m.CreatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *Article) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	if err := validate.FormatOf("id", "body", "uuid4", m.ID.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *Article) validateImage(formats strfmt.Registry) error {

	if err := validate.Required("image", "body", m.Image); err != nil {
		return err
	}

	return nil
}

func (m *Article) validateTitle(formats strfmt.Registry) error {

	if err := validate.Required("title", "body", m.Title); err != nil {
		return err
	}

	if err := validate.MaxLength("title", "body", *m.Title, 255); err != nil {
		return err
	}

	return nil
}

func (m *Article) validateUpdatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.UpdatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("updated_at", "body", "date-time", m.UpdatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this article based on context it is used
func (m *Article) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *Article) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *Article) UnmarshalBinary(b []byte) error {
	var res Article
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
