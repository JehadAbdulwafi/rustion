package util

import (
	"database/sql"
	"errors"
	"time"

	"github.com/golang-jwt/jwt"
)

var secretKey = []byte("SecretYouShouldHide")

func GenerateJwt(id string, exp time.Duration) (sql.NullString, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": id,                // Subject (user identifier)
		"iss": "rustion",         // Issuer
		"aud": "customer",        // Audience (user role)
		"exp": time.Now().Add(exp).Unix(), // Expiration time as Unix timestamp
		"iat": time.Now().Unix(), // Issued at
	})

	tokenString, err := claims.SignedString(secretKey)
	if err != nil {
		return sql.NullString{}, err
	}

	res := sql.NullString{}
	if tokenString != "" {
		res.String = tokenString
		res.Valid = true
	}

	return res, nil
}

func VerifyJWT(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil

	})

	if err != nil {
		return jwt.MapClaims{}, err
	}

	if !token.Valid {
		return jwt.MapClaims{}, errors.New("invalid token")
	}

	return token.Claims.(jwt.MapClaims), nil
}
