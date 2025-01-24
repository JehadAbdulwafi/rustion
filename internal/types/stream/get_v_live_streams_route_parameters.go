// Code generated by go-swagger; DO NOT EDIT.

package stream

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
)

// NewGetVLiveStreamsRouteParams creates a new GetVLiveStreamsRouteParams object
// no default values defined in spec.
func NewGetVLiveStreamsRouteParams() GetVLiveStreamsRouteParams {

	return GetVLiveStreamsRouteParams{}
}

// GetVLiveStreamsRouteParams contains all the bound params for the get v live streams route operation
// typically these are obtained from a http.Request
//
// swagger:parameters GetVLiveStreamsRoute
type GetVLiveStreamsRouteParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewGetVLiveStreamsRouteParams() beforehand.
func (o *GetVLiveStreamsRouteParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *GetVLiveStreamsRouteParams) Validate(formats strfmt.Registry) error {
	var res []error

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
