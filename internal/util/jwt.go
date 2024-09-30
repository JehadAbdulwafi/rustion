package util

import (
	"database/sql"
	"time"

	"github.com/golang-jwt/jwt"
)

var secretKey = []byte("SecretYouShouldHide")

func GenerateJwt(email string, exp time.Duration) (sql.NullString, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": email,             // Subject (user identifier)
		"iss": "rustion",         // Issuer
		"aud": "customer",        // Audience (user role)
		"exp": exp,               // Expiration time
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

func VerifyJWT(tokenString string) bool {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil

	})

	if err != nil {
		return false
	}

	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return false
	}

	return token.Valid
}
