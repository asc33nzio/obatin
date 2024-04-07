package middleware

import "git.garena.com/naufal.yassar/group-project/config"

type GinMiddleware struct {
	config *config.Config
}

func NewGinMiddleware(config *config.Config) *GinMiddleware {
	return &GinMiddleware{
		config: config,
	}
}
