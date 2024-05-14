package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type DoctorSpecializationHandler struct {
	doctorSpecializationUsecase usecase.DoctorSpecializationUsecase
}

func NewDoctorSpecializationHandler(doctorSpecializationUsecase usecase.DoctorSpecializationUsecase) *DoctorSpecializationHandler {
	return &DoctorSpecializationHandler{
		doctorSpecializationUsecase: doctorSpecializationUsecase,
	}
}

func (h *DoctorSpecializationHandler) GetAll(ctx *gin.Context) {
	specializations, err := h.doctorSpecializationUsecase.GetAll(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetAllSpecializationsRes(specializations)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseGetDoctorSpecializations,
		Data:    res,
	})
}
