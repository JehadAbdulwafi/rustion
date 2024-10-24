// Code generated by go-swagger; DO NOT EDIT.

package types

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// CreateFeaturedSectionResponse create featured section response
//
// swagger:model createFeaturedSectionResponse
type CreateFeaturedSectionResponse struct {

	// message
	// Example: Featured section created successfully.
	Message string `json:"message,omitempty"`
}

// Validate validates this create featured section response
func (m *CreateFeaturedSectionResponse) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this create featured section response based on context it is used
func (m *CreateFeaturedSectionResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *CreateFeaturedSectionResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *CreateFeaturedSectionResponse) UnmarshalBinary(b []byte) error {
	var res CreateFeaturedSectionResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}