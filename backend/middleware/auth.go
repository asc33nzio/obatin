package middleware

import (
	"obatin/appconstant"
	"obatin/apperror"
	"strings"

	"github.com/gin-gonic/gin"
)

func (m *GinMiddleware) JWTAuth(ctx *gin.Context) {
	bearerToken := ctx.GetHeader(appconstant.HeaderBearerToken)
	if bearerToken == "" {
		ctx.Error(apperror.ErrNotLogin(nil))
		ctx.Abort()
		return
	}

	if !strings.HasPrefix(bearerToken, appconstant.PrefixBearerToken) {
		ctx.Error(apperror.ErrInvalidToken(nil))
		ctx.Abort()
		return
	}

	accessToken := strings.Fields(bearerToken)[1]

	claims, err := m.jwtAuth.ParseAndVerify(accessToken, m.config.JwtSecret())
	if err != nil {
		if strings.Contains(err.Error(), appconstant.ErrorTokenIsExpired) {
			ctx.Error(apperror.ErrTokenHasExpired(err))
		} else {
			ctx.Error(apperror.ErrInvalidToken(err))
		}
		ctx.Abort()
		return
	}

	ctx.Set(appconstant.AuthenticationIdKey, claims.Payload.AuthenticationId)
	ctx.Set(appconstant.AuthenticationRole, claims.Payload.Role)
	ctx.Set(appconstant.IsVerifiedKey, claims.Payload.IsVerified)
	ctx.Set(appconstant.IsApprovedKey, claims.Payload.IsApproved)
	ctx.Next()
}
