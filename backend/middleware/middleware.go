package middleware

import "obatin/config"

type GinMiddleware struct {
	config *config.Config
}

func NewGinMiddleware(config *config.Config) *GinMiddleware {
	return &GinMiddleware{
		config: config,
	}
}
