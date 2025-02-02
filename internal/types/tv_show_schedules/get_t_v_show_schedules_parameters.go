// Code generated by go-swagger; DO NOT EDIT.

package tv_show_schedules

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/validate"
)

// NewGetTVShowSchedulesParams creates a new GetTVShowSchedulesParams object
// no default values defined in spec.
func NewGetTVShowSchedulesParams() GetTVShowSchedulesParams {

	return GetTVShowSchedulesParams{}
}

// GetTVShowSchedulesParams contains all the bound params for the get t v show schedules operation
// typically these are obtained from a http.Request
//
// swagger:parameters GetTVShowSchedules
type GetTVShowSchedulesParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*ID of the TV show
	  Required: true
	  In: path
	*/
	ID strfmt.UUID4 `param:"id"`
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewGetTVShowSchedulesParams() beforehand.
func (o *GetTVShowSchedulesParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	rID, rhkID, _ := route.Params.GetOK("id")
	if err := o.bindID(rID, rhkID, route.Formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *GetTVShowSchedulesParams) Validate(formats strfmt.Registry) error {
	var res []error

	// id
	// Required: true
	// Parameter is provided by construction from the route

	if err := o.validateID(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindID binds and validates parameter ID from path.
func (o *GetTVShowSchedulesParams) bindID(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// Parameter is provided by construction from the route

	// Format: uuid4
	value, err := formats.Parse("uuid4", raw)
	if err != nil {
		return errors.InvalidType("id", "path", "strfmt.UUID4", raw)
	}
	o.ID = *(value.(*strfmt.UUID4))

	if err := o.validateID(formats); err != nil {
		return err
	}

	return nil
}

// validateID carries on validations for parameter ID
func (o *GetTVShowSchedulesParams) validateID(formats strfmt.Registry) error {

	if err := validate.FormatOf("id", "path", "uuid4", o.ID.String(), formats); err != nil {
		return err
	}
	return nil
}
