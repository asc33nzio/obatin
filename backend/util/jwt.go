package util

import (
	"obatin/apperror"
	"obatin/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTItf interface {
	CreateAndSign(payload JWTPayload, exp int, secretKey string) (string, error)
	ParseAndVerify(signed string, secretKey string) (*JWTCustomClaims, error)
}

type JWTPayload struct {
	AuthenticationId int64  `json:"aid,omitempty"`
	Role             string `json:"role,omitempty"`
	RandomToken      string `json:"random_token,omitempty"`
	IsVerified       bool   `json:"is_verified"`
	IsApproved       bool   `json:"is_approved"`
}

type JWTCustomClaims struct {
	RegisteredClaims jwt.RegisteredClaims
	Payload          JWTPayload
}

type JWTAuth struct {
	config *config.Config
}

func NewJWTAuth(config *config.Config) *JWTAuth {
	return &JWTAuth{
		config: config,
	}
}

func (j *JWTAuth) CreateAndSign(payload JWTPayload, exp int, secretKey string) (string, error) {
	expTime := jwt.NewNumericDate(time.Now().Add(time.Duration(exp) * time.Minute))
	iat := jwt.NewNumericDate(time.Now())
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, JWTCustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    j.config.JwtIss(),
			ExpiresAt: expTime,
			IssuedAt:  iat,
		},
		Payload: payload,
	})
	signed, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return signed, nil
}

func (j *JWTAuth) ParseAndVerify(signed string, secretKey string) (*JWTCustomClaims, error) {
	token, err := jwt.ParseWithClaims(signed, &JWTCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	}, jwt.WithIssuer(j.config.JwtIss()),
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Name}),
		jwt.WithExpirationRequired(),
		jwt.WithIssuedAt(),
	)
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*JWTCustomClaims); ok {
		return claims, nil
	}

	return nil, apperror.ErrStlUnknownClaims
}

func (c JWTCustomClaims) GetExpirationTime() (*jwt.NumericDate, error) {
	return c.RegisteredClaims.ExpiresAt, nil
}

func (c JWTCustomClaims) GetIssuedAt() (*jwt.NumericDate, error) {
	return c.RegisteredClaims.IssuedAt, nil
}

func (c JWTCustomClaims) GetNotBefore() (*jwt.NumericDate, error) {
	return c.RegisteredClaims.NotBefore, nil
}

func (c JWTCustomClaims) GetIssuer() (string, error) {
	return c.RegisteredClaims.Issuer, nil
}

func (c JWTCustomClaims) GetSubject() (string, error) {
	return c.RegisteredClaims.Subject, nil
}

func (c JWTCustomClaims) GetAudience() (jwt.ClaimStrings, error) {
	return c.RegisteredClaims.Audience, nil
}
