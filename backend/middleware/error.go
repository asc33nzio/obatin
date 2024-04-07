package middleware

import (
	"errors"
	"net/http"

	"git.garena.com/naufal.yassar/group-project/apperror"
	"git.garena.com/naufal.yassar/group-project/dto"
	"github.com/gin-gonic/gin"
)

func (m *GinMiddleware) ErrorHandler(ctx *gin.Context) {
	ctx.Next()
	if len(ctx.Errors) != 0 {
		var appErr *apperror.AppError
		if errors.As(ctx.Errors[0].Err, &appErr) {
			ctx.AbortWithStatusJSON(apperror.GetHttpStatusCode(appErr.Code()), dto.APIResponse{
				Message: appErr.Error(),
			})
			return
		}

		ctx.AbortWithStatusJSON(http.StatusInternalServerError, dto.APIResponse{
			Message: apperror.InternalErrMsg,
		})
		return
	}
}
