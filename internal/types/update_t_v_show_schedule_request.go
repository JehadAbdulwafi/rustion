// Code generated by go-swagger; DO NOT EDIT.

package types

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// UpdateTVShowScheduleRequest update t v show schedule request
//
// swagger:model updateTVShowScheduleRequest
type UpdateTVShowScheduleRequest []*UpdateTVShowScheduleRequestItems0

// Validate validates this update t v show schedule request
func (m UpdateTVShowScheduleRequest) Validate(formats strfmt.Registry) error {
	var res []error

	for i := 0; i < len(m); i++ {
		if swag.IsZero(m[i]) { // not required
			continue
		}

		if m[i] != nil {
			if err := m[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName(strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName(strconv.Itoa(i))
				}
				return err
			}
		}

	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// ContextValidate validate this update t v show schedule request based on the context it is used
func (m UpdateTVShowScheduleRequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	for i := 0; i < len(m); i++ {

		if m[i] != nil {

			if swag.IsZero(m[i]) { // not required
				return nil
			}

			if err := m[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName(strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName(strconv.Itoa(i))
				}
				return err
			}
		}

	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// UpdateTVShowScheduleRequestItems0 update t v show schedule request items0
//
// swagger:model UpdateTVShowScheduleRequestItems0
type UpdateTVShowScheduleRequestItems0 struct {

	// Day of the week for the schedule
	// Example: Monday
	// Required: true
	Day *string `json:"day"`

	// Indicates if the show is active on this day
	// Example: true
	// Required: true
	IsActive *bool `json:"is_active"`

	// Time of the schedule
	// Example: 14:00:00
	// Required: true
	Time *string `json:"time"`
}

// Validate validates this update t v show schedule request items0
func (m *UpdateTVShowScheduleRequestItems0) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateDay(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateIsActive(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTime(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *UpdateTVShowScheduleRequestItems0) validateDay(formats strfmt.Registry) error {

	if err := validate.Required("day", "body", m.Day); err != nil {
		return err
	}

	return nil
}

func (m *UpdateTVShowScheduleRequestItems0) validateIsActive(formats strfmt.Registry) error {

	if err := validate.Required("is_active", "body", m.IsActive); err != nil {
		return err
	}

	return nil
}

func (m *UpdateTVShowScheduleRequestItems0) validateTime(formats strfmt.Registry) error {

	if err := validate.Required("time", "body", m.Time); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this update t v show schedule request items0 based on context it is used
func (m *UpdateTVShowScheduleRequestItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *UpdateTVShowScheduleRequestItems0) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *UpdateTVShowScheduleRequestItems0) UnmarshalBinary(b []byte) error {
	var res UpdateTVShowScheduleRequestItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
