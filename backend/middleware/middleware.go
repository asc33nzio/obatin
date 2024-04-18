package middleware

import (
	"obatin/config"
	"obatin/util"
)

type GinMiddleware struct {
	config *config.Config
	jwtAuth util.JWTItf
}

func NewGinMiddleware(config *config.Config, jwtAuth util.JWTItf) *GinMiddleware {
	return &GinMiddleware{
		config: config,
		jwtAuth: jwtAuth,
	}
}
