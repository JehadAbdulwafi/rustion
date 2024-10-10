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

// CreateStreamResponse create stream response
//
// swagger:model createStreamResponse
type CreateStreamResponse struct {

	// ID of stream
	// Example: 891d37d3-c74f-493e-aea8-af73efd92016
	// Required: true
	// Format: uuid4
	ID *strfmt.UUID4 `json:"id"`

	// URL of stream
	// Example: url
	URL string `json:"url,omitempty"`
}

// Validate validates this create stream response
func (m *CreateStreamResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *CreateStreamResponse) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	if err := validate.FormatOf("id", "body", "uuid4", m.ID.String(), formats); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this create stream response based on context it is used
func (m *CreateStreamResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *CreateStreamResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *CreateStreamResponse) UnmarshalBinary(b []byte) error {
	var res CreateStreamResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
