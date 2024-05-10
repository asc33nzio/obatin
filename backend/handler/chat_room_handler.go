package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/constant"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type ChatRoomHandler struct {
	chatRoomUsecase       usecase.ChatRoomUsecase
	authenticationUsecase usecase.AuthenticationUsecase
}

func NewChatRoomHandler(chatRoomUsecase usecase.ChatRoomUsecase, authenticationUsecase usecase.AuthenticationUsecase) *ChatRoomHandler {
	return &ChatRoomHandler{
		chatRoomUsecase:       chatRoomUsecase,
		authenticationUsecase: authenticationUsecase,
	}
}

func (h *ChatRoomHandler) CreateChatRoom(ctx *gin.Context) {
	body := dto.ChatRoomReq{}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.chatRoomUsecase.CreateChatRoom(ctx, body.ToChatRoom())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseCreateChatRoomMsg,
	})
}

func (h *ChatRoomHandler) GetAllMessageByChatRoomId(ctx *gin.Context) {
	var idParam dto.ChatRoomIdParam
	err := ctx.ShouldBindUri(&idParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	allMessage, err := h.chatRoomUsecase.GetAllChatRoomMessageById(ctx, int64(idParam.Id))
	if err != nil {
		ctx.Error(err)
		return
	}

	chatRoom, err := h.chatRoomUsecase.GetChatRoomById(ctx, idParam.Id)
	if err != nil {
		ctx.Error(err)
		return
	}

	user, err := h.authenticationUsecase.GetUserById(ctx, chatRoom.UserId)
	if err != nil {
		ctx.Error(err)
		return
	}

	doctor, err := h.authenticationUsecase.GetDoctorById(ctx, chatRoom.DoctorId)
	if err != nil {
		ctx.Error(err)
		return
	}
	doctor.Certificate = ""

	res := dto.ToGetAllMessageInChatRoom(allMessage)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseGetAllMessageInOneChatRoomMsg,
		Data: dto.OneChatRoom{
			Message:        res,
			Id:             idParam.Id,
			User:           dto.ToUserDetailRes(user),
			Doctor:         dto.ToDoctorDetailResponse(doctor),
			IsDoctorTyping: chatRoom.IsDoctorTyping,
			IsUserTyping:   chatRoom.IsUserTyping,
		},
	})
}

func (h *ChatRoomHandler) UpdateIsTyping(ctx *gin.Context) {

	var idParam dto.ChatRoomIdParam
	err := ctx.ShouldBindUri(&idParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	body := dto.UpdateIsTypingReq{}
	body.ChatRoomId = idParam.Id

	err = ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationRole, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		apperror.NewInternal(apperror.ErrStlInterfaceCasting)
		return
	}

	if authenticationRole == constant.RoleDoctor {
		err = h.chatRoomUsecase.UpdateIsTyping(ctx, body.ToUpdateIsTypingDoctor(), body.ChatRoomId)
		if err != nil {
			ctx.Error(err)
			return
		}
	}

	if authenticationRole == constant.RoleUser {
		err = h.chatRoomUsecase.UpdateIsTyping(ctx, body.ToUpdateIsTypingUser(), body.ChatRoomId)
		if err != nil {
			ctx.Error(err)
			return
		}
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseUpdateIsTypingMsg,
	})
}

func (h *ChatRoomHandler) GetListChatRoom(ctx *gin.Context) {
	paginationQuery := dto.PaginationReq{}
	err := ctx.ShouldBindQuery(&paginationQuery)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	paginationParams := paginationQuery.ToPaginationEntity()
	messageChatRoom, err := h.chatRoomUsecase.GetAllChatRoom(ctx, paginationParams)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetAllChatRoomRes(messageChatRoom.ChatRooms)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    constant.ResponseGetAllChatRoomMsg,
		Pagination: (*dto.PaginationResponse)(&messageChatRoom.Pagination),
		Data:       res,
	})
}

func (h *ChatRoomHandler) DeleteChatRoom(ctx *gin.Context) {

	var idParam dto.ChatRoomIdParam
	err := ctx.ShouldBindUri(&idParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.chatRoomUsecase.DeleteChatRoom(ctx, idParam.Id)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseDeleteChatRoomMsg,
	})
}
