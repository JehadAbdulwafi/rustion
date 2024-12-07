package util

import (
	"crypto/rand"
	"errors"
	"regexp"
	"strings"
)

// GenerateRandomBytes returns n random bytes securely generated using the system's default CSPRNG.
//
// An error will be returned if reading from the secure random number generator fails, at which point
// the returned result should be discarded and not used any further.
func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)

	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}

	return b, nil
}

type CharRange int

const (
	CharRangeNumeric CharRange = iota
	CharRangeAlphaLowerCase
	CharRangeAlphaUpperCase
)

// GenerateRandomString returns a string with n random bytes securely generated using the system's
// default CSPRNG. The characters within the generated string will either be part of one ore more supplied
// range of characters, or based on characters in the extra string supplied.
//
// An error will be returned if reading from the secure random number generator fails, at which point
// the returned result should be discarded and not used any further.
func GenerateRandomString(n int, ranges []CharRange, extra string) (string, error) {
	var str strings.Builder

	if len(ranges) == 0 && len(extra) == 0 {
		return "", errors.New("random string can only be created if set of characters or extra string characters supplied")
	}

	validateFn := func(c byte) bool {
		// IndexByte(string, byte) is basically Contains(string, string) without casting
		if strings.IndexByte(extra, c) >= 0 {
			return true
		}

		for _, r := range ranges {
			switch r {
			case CharRangeNumeric:
				if c >= '0' && c <= '9' {
					return true
				}
			case CharRangeAlphaLowerCase:
				if c >= 'a' && c <= 'z' {
					return true
				}
			case CharRangeAlphaUpperCase:
				if c >= 'A' && c <= 'Z' {
					return true
				}
			}
		}

		return false
	}

	for str.Len() < n {

		buf, err := GenerateRandomBytes(n)
		if err != nil {
			return "", err
		}

		for _, b := range buf {
			if validateFn(b) {
				str.WriteByte(b)
			}
			if str.Len() >= n {
				break
			}
		}
	}

	return str.String(), nil
}

// Lowercases a string and trims whitespace from the beginning and end of the string
func ToUsernameFormat(s string) string {
	return strings.TrimSpace(strings.ToLower(s))
}

// ToSlug converts a string to a URL-friendly slug
func ToSlug(s string) string {
	// Convert to lowercase
	s = strings.ToLower(s)

	// Replace spaces with hyphens
	s = strings.ReplaceAll(s, " ", "-")

	// Remove all non-alphanumeric characters except hyphens
	reg := regexp.MustCompile("[^a-z0-9-]+")
	s = reg.ReplaceAllString(s, "")

	// Remove multiple consecutive hyphens
	reg = regexp.MustCompile("-+")
	s = reg.ReplaceAllString(s, "-")

	// Remove leading and trailing hyphens
	s = strings.Trim(s, "-")

	return s
}

// StringValue safely gets the value of a string pointer
// If the pointer is nil, returns an empty string
func StringValue(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
