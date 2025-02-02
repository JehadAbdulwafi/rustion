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

// UpdateTVShowRequest update t v show request
//
// swagger:model updateTVShowRequest
type UpdateTVShowRequest struct {

	// Description of the TV show
	// Example: This is the description of the TV show.
	Description string `json:"description,omitempty"`

	// Genre of the TV show
	// Example: Drama
	Genre string `json:"genre,omitempty"`

	// Image of the TV show
	// Example: https://example.com/image.jpg
	Image string `json:"image,omitempty"`

	// Title of the TV show
	// Example: TV Show Title
	// Required: true
	// Max Length: 255
	Title *string `json:"title"`
}

// Validate validates this update t v show request
func (m *UpdateTVShowRequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateTitle(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *UpdateTVShowRequest) validateTitle(formats strfmt.Registry) error {

	if err := validate.Required("title", "body", m.Title); err != nil {
		return err
	}

	if err := validate.MaxLength("title", "body", *m.Title, 255); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this update t v show request based on context it is used
func (m *UpdateTVShowRequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *UpdateTVShowRequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *UpdateTVShowRequest) UnmarshalBinary(b []byte) error {
	var res UpdateTVShowRequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
