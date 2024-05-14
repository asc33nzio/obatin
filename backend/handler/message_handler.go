package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type MessageHandler struct {
	messageUsecase usecase.MessageUsecase
}

func NewMessageHandler(messageUsecase usecase.MessageUsecase) *MessageHandler {
	return &MessageHandler{
		messageUsecase: messageUsecase,
	}
}

func (h *MessageHandler) CreateMessage(ctx *gin.Context) {
	body := dto.MessageReq{}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.messageUsecase.CreateMessage(ctx, body.ToMessage())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseCreateMessageMsg,
	})
}
