package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type PrescriptionHandler struct {
	prescriptionUsecase usecase.PrescriptionUsecase
}

func NewPrescriptionHandler(prescriptionUsecase usecase.PrescriptionUsecase) *PrescriptionHandler {
	return &PrescriptionHandler{
		prescriptionUsecase: prescriptionUsecase,
	}
}

func (h *PrescriptionHandler) CreatePrescription(ctx *gin.Context) {
	body := dto.CreatePrescriptionReq{}

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleDoctor {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
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

	id, err := h.prescriptionUsecase.CreatePrescription(ctx, body.ToCreatePrescription())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: appconstant.ResponsePrescriptionCreatedMsg,
		Data:    dto.CreatePrescriptionRes{PrescriptionId: *id},
	})
}

func (h *PrescriptionHandler) GetAllUserPrescriptions(ctx *gin.Context) {
	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleUser {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	prescriptions, err := h.prescriptionUsecase.GetAllUserPrescriptions(ctx, authenticationId)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetAllUserPrescriptionRes(prescriptions)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *PrescriptionHandler) GetAllDoctorPrescriptions(ctx *gin.Context) {
	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleDoctor {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	prescriptions, err := h.prescriptionUsecase.GetAllDoctorPrescriptions(ctx, authenticationId)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetAllDoctorPrescriptionRes(prescriptions)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *PrescriptionHandler) GetPrescriptionDetails(ctx *gin.Context) {
	var uriParam dto.PrescriptionIdUriParam

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	err := ctx.ShouldBindUri(&uriParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	items, err := h.prescriptionUsecase.GetPrescriptionDetails(ctx, uriParam.Id)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetPrescriptionDetailsRes(items)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}
