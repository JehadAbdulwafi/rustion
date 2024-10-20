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

// UpdateFeaturedSectionRequest update featured section request
//
// swagger:model updateFeaturedSectionRequest
type UpdateFeaturedSectionRequest struct {

	// Title of the featured section
	// Required: true
	Title *string `json:"title"`
}

// Validate validates this update featured section request
func (m *UpdateFeaturedSectionRequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateTitle(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *UpdateFeaturedSectionRequest) validateTitle(formats strfmt.Registry) error {

	if err := validate.Required("title", "body", m.Title); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this update featured section request based on context it is used
func (m *UpdateFeaturedSectionRequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *UpdateFeaturedSectionRequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *UpdateFeaturedSectionRequest) UnmarshalBinary(b []byte) error {
	var res UpdateFeaturedSectionRequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
