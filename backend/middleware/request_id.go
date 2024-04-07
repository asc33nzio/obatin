package middleware

import (
	"git.garena.com/naufal.yassar/group-project/appconstant"
	"git.garena.com/naufal.yassar/group-project/apperror"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
