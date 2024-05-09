package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/constant"
	"obatin/dto"
	"obatin/entity"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	paymentUsecase usecase.PaymentUsecase
}

func NewPaymentHandler(paymentUsecase usecase.PaymentUsecase) *PaymentHandler {
	return &PaymentHandler{
		paymentUsecase: paymentUsecase,
	}
}

func (h *PaymentHandler) UploadPaymentProof(ctx *gin.Context) {
	var uriParams dto.PaymentIdUriParams

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	isVerified, ok := ctx.Value(constant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	err := ctx.ShouldBindUri(&uriParams)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	file, fileHeader, err := ctx.Request.FormFile(constant.FileUrlFormKey)
	if err != nil && err != http.ErrMissingFile {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	if file != nil && fileHeader != nil {
		isValidFileUploaded := appvalidator.IsValidImageUploaded(int(fileHeader.Size), fileHeader.Filename)

		if !isValidFileUploaded {
			ctx.Error(apperror.ErrImgUploadInvalid(nil))
			return
		}
		defer file.Close()
	}

	err = h.paymentUsecase.UploadPaymentProof(ctx,
		&entity.Payment{
			Id:               uriParams.Id,
			User:             entity.User{Authentication: entity.Authentication{Id: authenticationId}},
			PaymentProofFile: file,
		})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
	})
}

func (h *PaymentHandler) UpdatePaymentStatus(ctx *gin.Context) {
	var body dto.PaymentProofConfirmationReq

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != constant.RoleAdmin {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}

	isVerified, ok := ctx.Value(constant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.paymentUsecase.UpdatePaymentStatus(ctx, &entity.Payment{
		Id:          body.PaymentId,
		User:        entity.User{Id: &body.UserId},
		IsConfirmed: body.IsConfirmed,
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
	})
}

func (h *PaymentHandler) GetAllPendingPayment(ctx *gin.Context) {
	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != constant.RoleAdmin {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}

	isVerified, ok := ctx.Value(constant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	payments, err := h.paymentUsecase.GetAllPendingPayments(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
		Data:    payments,
	})
}

func (h *PaymentHandler) CancelPayment(ctx *gin.Context) {
	var uriParams dto.PaymentIdUriParams

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	isVerified, ok := ctx.Value(constant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	err := ctx.ShouldBindUri(&uriParams)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.paymentUsecase.CancelPayment(ctx,
		&entity.Payment{
			Id:   uriParams.Id,
			User: entity.User{Authentication: entity.Authentication{Id: authenticationId}},
		})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
	})
}
