package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/constant"
	"obatin/dto"
	"obatin/usecase"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AuthenticationHandler struct {
	userUsecase usecase.AuthenticationUsecase
}

func NewAuthenticationHandler(userUsecase usecase.AuthenticationUsecase) *AuthenticationHandler {
	return &AuthenticationHandler{
		userUsecase: userUsecase,
	}
}

func (h *AuthenticationHandler) Login(ctx *gin.Context) {
	body := dto.UserLoginReq{}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	token, err := h.userUsecase.Login(ctx, body.ToUser())
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.UserAccessToken{AccessToken: token}
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseLoginMsg,
		Data:    res,
	})
}

func (h *AuthenticationHandler) RegisterDoctor(ctx *gin.Context) {
	body := dto.DoctorRegisterReq{}

	file, FileHeader, err := ctx.Request.FormFile(constant.CertificateJSONTag)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	isValidFileUploaded := appvalidator.IsValidFileUploaded(int(FileHeader.Size), FileHeader.Filename)

	if !isValidFileUploaded {
		ctx.Error(apperror.ErrFileUploadInvalid(apperror.ErrStlUploadFileInvalid))
		return
	}
	defer file.Close()

	body = dto.DoctorRegisterReq{
		Email:       ctx.Request.FormValue(constant.EmailJSONTag),
		Certificate: file,
	}

	err = h.userUsecase.RegisterDoctor(ctx, body.ToDoctor())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: constant.ResponseRegisterMsg,
	})
}

func (h *AuthenticationHandler) RegisterUser(ctx *gin.Context) {
	body := dto.UserRegisterReq{}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.userUsecase.RegisterUser(ctx, body.ToUser())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: constant.ResponseRegisterMsg,
	})
}

func (h *AuthenticationHandler) SendVerifyToEmail(ctx *gin.Context) {
	err := h.userUsecase.SendVerifiedEmail(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: constant.ResponseSendVerifyToEmailMsg,
	})
}

func (h *AuthenticationHandler) VerifyEmail(ctx *gin.Context) {
	token := ctx.Query(constant.TokenQueryParam)

	err := h.userUsecase.VerifiedEmail(ctx, token)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: constant.ResponseVerifiedMsg,
	})
}

func (h *AuthenticationHandler) UpdatePassword(ctx *gin.Context) {
	token := ctx.Query(constant.TokenQueryParam)
	body := dto.UpdatePasswordReq{}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.userUsecase.UpdatePassword(ctx, body.ToPassword(), token)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseUpdatePasswordMsg,
	})
}

func (h *AuthenticationHandler) UpdateApproval(ctx *gin.Context) {
	authID, err := strconv.Atoi(ctx.Param(constant.AuthenticationIDParam))
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	isApprove, err := strconv.ParseBool(ctx.Query(constant.ApproveQueryParam))
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	_, err = h.userUsecase.UpdateApproval(ctx, authID, isApprove)

	if err != nil {
		ctx.JSON(http.StatusOK, dto.APIResponse{
			Message: constant.ResponseUpdateApprovalRejectedMsg,
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseUpdateApprovalAcceptedMsg,
	})
}
