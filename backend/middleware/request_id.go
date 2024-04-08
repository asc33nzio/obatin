package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"obatin/appconstant"
	"obatin/apperror"
)

func (m *GinMiddleware) RequestId(ctx *gin.Context) {
	uuid, err := uuid.NewUUID()
	if err != nil {
		ctx.Error(apperror.NewInternal(err))
		ctx.Abort()
		return
	}

	ctx.Set(appconstant.RequestIdKey, uuid)
	ctx.Next()
}
