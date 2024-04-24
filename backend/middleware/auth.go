package middleware

import (
	"obatin/apperror"
	"obatin/constant"
	"strings"

	"github.com/gin-gonic/gin"
)

func (m *GinMiddleware) JWTAuth(ctx *gin.Context) {
	bearerToken := ctx.GetHeader(constant.HeaderBearerToken)
	if bearerToken == "" {
		ctx.Error(apperror.ErrNotLogin(nil))
		ctx.Abort()
		return
	}

	if !strings.HasPrefix(bearerToken, constant.PrefixBearerToken) {
		ctx.Error(apperror.ErrInvalidToken(nil))
		ctx.Abort()
		return
	}

	accessToken := strings.Fields(bearerToken)[1]

	claims, err := m.jwtAuth.ParseAndVerify(accessToken, m.config.JwtSecret())
	if err != nil {
		if strings.Contains(err.Error(), constant.ErrorTokenIsExpired) {
			ctx.Error(apperror.ErrTokenHasExpired(err))
		} else {
			ctx.Error(apperror.ErrInvalidToken(err))
		}
		ctx.Abort()
		return
	}

	aid := claims.Payload.AuthenticationId
	arole := claims.Payload.Role

	ctx.Set(constant.AuthenticationIdKey, aid)
	ctx.Set(constant.AuthenticationRole, arole)
	ctx.Next()
}
