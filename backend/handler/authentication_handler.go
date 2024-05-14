package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/appvalidator"
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

	isExtendedQuery := ctx.Query(appconstant.IsExtendedQueryParam)
	var isExtended bool
	if isExtendedQuery == "true" {
		isExtended = true
	} else {
		isExtended = false
	}

	token, err := h.userUsecase.Login(ctx, body.ToUser(), isExtended)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.UserAccessToken{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseLoginMsg,
		Data:    res,
	})
}

func (h *AuthenticationHandler) RegisterDoctor(ctx *gin.Context) {

	file, FileHeader, err := ctx.Request.FormFile(appconstant.CertificateJSONTag)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	isValidFileUploaded := appvalidator.IsValidCertificateFileUploaded(int(FileHeader.Size), FileHeader.Filename)

	if !isValidFileUploaded {
		ctx.Error(apperror.ErrFileCertificateUploadInvalid(apperror.ErrStlUploadFileInvalid))
		return
	}
	defer file.Close()

	result, err := strconv.Atoi(ctx.Request.FormValue(appconstant.SpecializationIdJSONTag))
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}
	body := dto.DoctorRegisterReq{
		Email:            ctx.Request.FormValue(appconstant.EmailJSONTag),
		Certificate:      file,
		SpecializationId: int64(result),
	}
	err = ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.userUsecase.RegisterDoctor(ctx, body.ToDoctor())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: appconstant.ResponseRegisterMsg,
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
		Message: appconstant.ResponseRegisterMsg,
	})
}

func (h *AuthenticationHandler) SendVerifyToEmail(ctx *gin.Context) {
	err := h.userUsecase.SendVerificationEmail(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: appconstant.ResponseSendVerifyToEmailMsg,
	})
}

func (h *AuthenticationHandler) VerifyEmail(ctx *gin.Context) {
	token := ctx.Query(appconstant.TokenQueryParam)

	err := h.userUsecase.VerifyEmail(ctx, token)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseVerifiedMsg,
	})
}

func (h *AuthenticationHandler) UpdatePasswordByToken(ctx *gin.Context) {
	token := ctx.Query(appconstant.TokenQueryParam)
	body := dto.UpdatePasswordReq{}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.userUsecase.UpdatePasswordWithToken(ctx, body.ToPassword(), token)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseUpdatePasswordMsg,
	})
}

func (h *AuthenticationHandler) UpdatePasswordByAuth(ctx *gin.Context) {
	body := dto.UpdateProfilePasswordReq{}
	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.userUsecase.UpdatePassword(ctx, body.ToUpdatePassword())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseUpdatePasswordMsg,
	})
}

func (h *AuthenticationHandler) UpdateApproval(ctx *gin.Context) {
	authID, err := strconv.Atoi(ctx.Param(appconstant.AuthenticationIDParam))
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	isApprove, err := strconv.ParseBool(ctx.Query(appconstant.ApproveQueryParam))
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.userUsecase.UpdateApproval(ctx, authID, isApprove)

	if err != nil {
		ctx.JSON(http.StatusOK, dto.APIResponse{
			Message: appconstant.ResponseUpdateApprovalRejectedMsg,
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseUpdateApprovalAcceptedMsg,
	})
}

func (h *AuthenticationHandler) SendVerifyForgotPassword(ctx *gin.Context) {
	body := dto.UpdatePasswordReq{}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.userUsecase.SendEmailForgotPasssword(ctx, body.ToEmail())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseSendVerifyResetPassword,
	})
}

func (h *AuthenticationHandler) GetPendingDoctorApproval(ctx *gin.Context) {
	paginationQuery := dto.PaginationReq{}
	err := ctx.ShouldBindQuery(&paginationQuery)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	paginationParams := paginationQuery.ToPaginationEntity()
	doctorPendingApproval, err := h.userUsecase.GetPendingDoctorApproval(ctx, paginationParams)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetAllDoctorPendingApprovalRes(doctorPendingApproval.Doctors)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    appconstant.ResponseGetAllPendingDoctorApproval,
		Pagination: (*dto.PaginationResponse)(&doctorPendingApproval.Pagination),
		Data:       res,
	})
}

func (h *AuthenticationHandler) GetRefreshToken(ctx *gin.Context) {

	tokenReq := dto.RefreshTokenReq{}
	if err := ctx.ShouldBindJSON(&tokenReq); err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	newTokens, err := h.userUsecase.GenerateRefreshToken(ctx, tokenReq.RefreshToken)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.UserAccessToken{
		AccessToken:  newTokens.AccessToken,
		RefreshToken: newTokens.RefreshToken,
	}
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseGetNewRefreshTokenMsg,
		Data:    res,
	})

}
