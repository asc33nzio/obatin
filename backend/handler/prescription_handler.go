package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/constant"
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

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
		return
	}

	if role != constant.RoleDoctor {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}

	isVerified, ok := ctx.Value(constant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
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

	err = h.prescriptionUsecase.CreatePrescription(ctx, body.ToCreatePrescription())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: constant.ResponsePrescriptionCreatedMsg,
	})
}
