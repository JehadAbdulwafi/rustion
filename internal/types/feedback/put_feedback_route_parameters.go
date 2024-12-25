// Code generated by go-swagger; DO NOT EDIT.

package feedback

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/validate"

	"github.com/JehadAbdulwafi/rustion/internal/types"
)

// NewPutFeedbackRouteParams creates a new PutFeedbackRouteParams object
// no default values defined in spec.
func NewPutFeedbackRouteParams() PutFeedbackRouteParams {

	return PutFeedbackRouteParams{}
}

// PutFeedbackRouteParams contains all the bound params for the put feedback route operation
// typically these are obtained from a http.Request
//
// swagger:parameters PutFeedbackRoute
type PutFeedbackRouteParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*
	  In: body
	*/
	Payload *types.FeedbackPayload
	/*ID of Feedback
	  Required: true
	  In: path
	*/
	ID strfmt.UUID4 `param:"id"`
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewPutFeedbackRouteParams() beforehand.
func (o *PutFeedbackRouteParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	if runtime.HasBody(r) {
		defer r.Body.Close()
		var body types.FeedbackPayload
		if err := route.Consumer.Consume(r.Body, &body); err != nil {
			res = append(res, errors.NewParseError("payload", "body", "", err))
		} else {
			// validate body object
			if err := body.Validate(route.Formats); err != nil {
				res = append(res, err)
			}

			if len(res) == 0 {
				o.Payload = &body
			}
		}
	}
	rID, rhkID, _ := route.Params.GetOK("id")
	if err := o.bindID(rID, rhkID, route.Formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PutFeedbackRouteParams) Validate(formats strfmt.Registry) error {
	var res []error

	// Payload
	// Required: false

	// body is validated in endpoint
	//if err := o.Payload.Validate(formats); err != nil {
	//  res = append(res, err)
	//}

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
func (o *PutFeedbackRouteParams) bindID(rawData []string, hasKey bool, formats strfmt.Registry) error {
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
func (o *PutFeedbackRouteParams) validateID(formats strfmt.Registry) error {

	if err := validate.FormatOf("id", "path", "uuid4", o.ID.String(), formats); err != nil {
		return err
	}
	return nil
}
