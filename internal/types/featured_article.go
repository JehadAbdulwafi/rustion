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

// FeaturedArticle featured article
//
// swagger:model featuredArticle
type FeaturedArticle struct {

	// Timestamp when the article was created
	// Example: 2023-10-01T12:00:00Z
	// Required: true
	// Format: date-time
	CreatedAt *strfmt.DateTime `json:"created_at"`

	// ID of the featured section
	// Example: 1
	// Required: true
	FeaturedSectionID *int64 `json:"featured_section_id"`

	// ID of the featured article
	// Example: 1
	// Required: true
	ID *int64 `json:"id"`

	// ID of the news article
	// Example: 1
	// Required: true
	NewsID *int64 `json:"news_id"`

	// Timestamp when the article was last updated
	// Example: 2023-10-02T12:00:00Z
	// Required: true
	// Format: date-time
	UpdatedAt *strfmt.DateTime `json:"updated_at"`
}

// Validate validates this featured article
func (m *FeaturedArticle) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCreatedAt(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateFeaturedSectionID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateNewsID(formats); err != nil {
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

func (m *FeaturedArticle) validateCreatedAt(formats strfmt.Registry) error {

	if err := validate.Required("created_at", "body", m.CreatedAt); err != nil {
		return err
	}

	if err := validate.FormatOf("created_at", "body", "date-time", m.CreatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *FeaturedArticle) validateFeaturedSectionID(formats strfmt.Registry) error {

	if err := validate.Required("featured_section_id", "body", m.FeaturedSectionID); err != nil {
		return err
	}

	return nil
}

func (m *FeaturedArticle) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	return nil
}

func (m *FeaturedArticle) validateNewsID(formats strfmt.Registry) error {

	if err := validate.Required("news_id", "body", m.NewsID); err != nil {
		return err
	}

	return nil
}

func (m *FeaturedArticle) validateUpdatedAt(formats strfmt.Registry) error {

	if err := validate.Required("updated_at", "body", m.UpdatedAt); err != nil {
		return err
	}

	if err := validate.FormatOf("updated_at", "body", "date-time", m.UpdatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this featured article based on context it is used
func (m *FeaturedArticle) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *FeaturedArticle) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *FeaturedArticle) UnmarshalBinary(b []byte) error {
	var res FeaturedArticle
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
