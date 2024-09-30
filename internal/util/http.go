package util

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/JehadAbdulwafi/rustion/internal/api/httperrors"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/gabriel-vasile/mimetype"
	oerrors "github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/labstack/echo/v4"
)

const (
	HTTPHeaderCacheControl = "Cache-Control"
	TokenTypeBearer        = "Bearer"
)

// BindAndValidateBody binds the request body and performs validation.
func BindAndValidateBody(c echo.Context, v runtime.Validatable) error {
	binder := c.Echo().Binder.(*echo.DefaultBinder)

	if err := binder.BindBody(c, v); err != nil {
		return err
	}

	return validatePayload(c, v)
}

// BindAndValidatePathAndQueryParams binds path and query params and performs validation.
func BindAndValidatePathAndQueryParams(c echo.Context, v runtime.Validatable) error {
	binder := c.Echo().Binder.(*echo.DefaultBinder)

	if err := binder.BindPathParams(c, v); err != nil {
		return err
	}

	if err := binder.BindQueryParams(c, v); err != nil {
		return err
	}

	return validatePayload(c, v)
}

// BindAndValidatePathParams binds path params and performs validation.
func BindAndValidatePathParams(c echo.Context, v runtime.Validatable) error {
	binder := c.Echo().Binder.(*echo.DefaultBinder)

	if err := binder.BindPathParams(c, v); err != nil {
		return err
	}

	return validatePayload(c, v)
}

// BindAndValidateQueryParams binds query params and performs validation.
func BindAndValidateQueryParams(c echo.Context, v runtime.Validatable) error {
	binder := c.Echo().Binder.(*echo.DefaultBinder)

	if err := binder.BindQueryParams(c, v); err != nil {
		return err
	}

	return validatePayload(c, v)
}

// BindAndValidate binds the request, parsing path+query+body and validating these structs.
func BindAndValidate(c echo.Context, v runtime.Validatable, vs ...runtime.Validatable) error {
	if len(vs) == 0 {
		if err := defaultEchoBindAll(c, v); err != nil {
			return err
		}

		return validatePayload(c, v)
	}

	var reqBody []byte
	var err error
	if c.Request().Body != nil {
		reqBody, err = io.ReadAll(c.Request().Body)
		if err != nil {
			return err
		}
	}

	if err = restoreBindAndValidate(c, reqBody, v); err != nil {
		return err
	}

	for _, vv := range vs {
		if err = restoreBindAndValidate(c, reqBody, vv); err != nil {
			return err
		}
	}

	return nil
}

// ValidateAndReturn returns the provided data as a JSON response after performing payload validation.
func ValidateAndReturn(c echo.Context, code int, v runtime.Validatable) error {
	if err := validatePayload(c, v); err != nil {
		return err
	}

	return c.JSON(code, v)
}

// ParseFileUpload handles file uploads and validates MIME types.
func ParseFileUpload(c echo.Context, formNameFile string, allowedMIMETypes []string) (*multipart.FileHeader, multipart.File, *mimetype.MIME, error) {
	log := LogFromEchoContext(c)

	fh, err := c.FormFile(formNameFile)
	if err != nil {
		log.Debug().Err(err).Msg("Failed to get form file")
		return nil, nil, nil, err
	}

	file, err := fh.Open()
	if err != nil {
		log.Debug().Err(err).Str("filename", fh.Filename).Int64("fileSize", fh.Size).Msg("Failed to open uploaded file")
		return nil, nil, nil, err
	}

	mime, err := mimetype.DetectReader(file)
	if err != nil {
		log.Debug().Err(err).Str("filename", fh.Filename).Int64("fileSize", fh.Size).Msg("Failed to detect MIME type of uploaded file")
		file.Close()
		return nil, nil, nil, err
	}

	if _, err = file.Seek(0, io.SeekStart); err != nil {
		log.Debug().Err(err).Str("filename", fh.Filename).Int64("fileSize", fh.Size).Msg("Failed to reset reader of uploaded file to start")
		file.Close()
		return nil, nil, nil, err
	}

	allowed := false
	for _, allowedType := range allowedMIMETypes {
		if mime.Is(allowedType) {
			log.Debug().
				Str("mimeType", mime.String()).
				Str("mimeTypeFileExtension", mime.Extension()).
				Str("filename", fh.Filename).
				Int64("fileSize", fh.Size).
				Str("allowedMIMEType", allowedType).
				Msg("MIME type of uploaded file is allowed, processing")

			allowed = true
			break
		}
	}

	if !allowed {
		log.Debug().
			Str("mimeType", mime.String()).
			Str("mimeTypeFileExtension", mime.Extension()).
			Str("filename", fh.Filename).
			Int64("fileSize", fh.Size).
			Msg("MIME type of uploaded file is not allowed, rejecting")
		file.Close()
		return nil, nil, nil, echo.ErrUnsupportedMediaType
	}

	return fh, file, mime, nil
}

func restoreBindAndValidate(c echo.Context, reqBody []byte, v runtime.Validatable) error {
	if reqBody != nil {
		c.Request().Body = io.NopCloser(bytes.NewBuffer(reqBody))
	}

	if err := defaultEchoBindAll(c, v); err != nil {
		return err
	}

	return validatePayload(c, v)
}

func validatePayload(c echo.Context, v runtime.Validatable) error {
	if err := v.Validate(strfmt.Default); err != nil {
		var compositeError *oerrors.CompositeError
		if errors.As(err, &compositeError) {
			LogFromEchoContext(c).Debug().Errs("validation_errors", compositeError.Errors).Msg("Payload did match schema, returning HTTP validation error")

			valErrs := formatValidationErrors(c.Request().Context(), compositeError)

			return httperrors.NewHTTPValidationError(http.StatusBadRequest, httperrors.HTTPErrorTypeGeneric, http.StatusText(http.StatusBadRequest), valErrs)
		}

		var validationError *oerrors.Validation
		if errors.As(err, &validationError) {
			LogFromEchoContext(c).Debug().AnErr("validation_error", validationError).Msg("Payload did match schema, returning HTTP validation error")

			valErrs := []*types.HTTPValidationErrorDetail{
				{
					Key:   &validationError.Name,
					In:    &validationError.In,
					Error: swag.String(validationError.Error()),
				},
			}

			return httperrors.NewHTTPValidationError(http.StatusBadRequest, httperrors.HTTPErrorTypeGeneric, http.StatusText(http.StatusBadRequest), valErrs)
		}

		LogFromEchoContext(c).Error().Err(err).Msg("Failed to validate payload, returning generic HTTP error")
		return err
	}

	return nil
}

// defaultEchoBindAll restores echo query binding pre 4.2.0 handling.
func defaultEchoBindAll(c echo.Context, v runtime.Validatable) (err error) {
	binder := c.Echo().Binder.(*echo.DefaultBinder)

	if err := binder.BindPathParams(c, v); err != nil {
		return err
	}
	if err = binder.BindQueryParams(c, v); err != nil {
		return err
	}

	return binder.BindBody(c, v)
}

func formatValidationErrors(ctx context.Context, err *oerrors.CompositeError) []*types.HTTPValidationErrorDetail {
	valErrs := make([]*types.HTTPValidationErrorDetail, 0, len(err.Errors))
	for _, e := range err.Errors {
		var compositeError *oerrors.CompositeError
		if errors.As(e, &compositeError) {
			valErrs = append(valErrs, formatValidationErrors(ctx, compositeError)...)
			continue
		}

		var validationError *oerrors.Validation
		if errors.As(e, &validationError) {
			valErrs = append(valErrs, &types.HTTPValidationErrorDetail{
				Key:   &validationError.Name,
				In:    &validationError.In,
				Error: swag.String(validationError.Error()),
			})
			continue
		}

		LogFromContext(ctx).Warn().Err(e).Str("err_type", fmt.Sprintf("%T", e)).Msg("Received unknown error type while validating payload, skipping")
	}

	return valErrs
}