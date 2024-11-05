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

// TVShow t v show
//
// swagger:model tVShow
type TVShow struct {

	// Timestamp when the TV show was created
	// Example: 2023-10-01T12:00:00Z
	// Format: date-time
	CreatedAt strfmt.DateTime `json:"created_at,omitempty"`

	// Description of the TV show
	// Example: This is the description of the TV show.
	// Required: true
	Description *string `json:"description"`

	// Genre of the TV show
	// Example: Drama
	// Required: true
	Genre *string `json:"genre"`

	// ID of the TV show
	// Example: 82ebdfad-c586-4407-a873-4cc1c33d56fc
	// Required: true
	// Format: uuid4
	ID *strfmt.UUID4 `json:"id"`

	// Title of the TV show
	// Example: TV Show Title
	// Required: true
	// Max Length: 255
	Title *string `json:"title"`

	// Timestamp when the TV show was last updated
	// Example: 2023-10-02T12:00:00Z
	// Format: date-time
	UpdatedAt strfmt.DateTime `json:"updated_at,omitempty"`
}

// Validate validates this t v show
func (m *TVShow) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCreatedAt(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateDescription(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateGenre(formats); err != nil {
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

func (m *TVShow) validateCreatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.CreatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("created_at", "body", "date-time", m.CreatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *TVShow) validateDescription(formats strfmt.Registry) error {

	if err := validate.Required("description", "body", m.Description); err != nil {
		return err
	}

	return nil
}

func (m *TVShow) validateGenre(formats strfmt.Registry) error {

	if err := validate.Required("genre", "body", m.Genre); err != nil {
		return err
	}

	return nil
}

func (m *TVShow) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	if err := validate.FormatOf("id", "body", "uuid4", m.ID.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *TVShow) validateTitle(formats strfmt.Registry) error {

	if err := validate.Required("title", "body", m.Title); err != nil {
		return err
	}

	if err := validate.MaxLength("title", "body", *m.Title, 255); err != nil {
		return err
	}

	return nil
}

func (m *TVShow) validateUpdatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.UpdatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("updated_at", "body", "date-time", m.UpdatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this t v show based on context it is used
func (m *TVShow) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *TVShow) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *TVShow) UnmarshalBinary(b []byte) error {
	var res TVShow
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
