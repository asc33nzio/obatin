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

type DoctorHandler struct {
	doctorUseCase usecase.DoctorUsecase
}

func NewDoctorHandler(doctorUseCase usecase.DoctorUsecase) *DoctorHandler {
	return &DoctorHandler{
		doctorUseCase: doctorUseCase,
	}
}

func (h *DoctorHandler) GetDoctorDetailbyId(ctx *gin.Context) {
	var idParam dto.IdUriParam
	err := ctx.ShouldBindUri(&idParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}
	doctorId, err := strconv.Atoi(idParam.Id)
	if err != nil {
		ctx.Error(apperror.ErrInvalidSlug(nil))
	}

	doctor, err := h.doctorUseCase.GetOneById(ctx, int64(doctorId))
	if err != nil {
		ctx.Error(err)
		return
	}

	isDoctor := checkDoctor(ctx)
	isAdmin := checkAdmin(ctx)
	if !isDoctor && !isAdmin {
		doctor.Certificate = ""
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
		Data:    dto.ToDoctorDetailResponse(doctor),
	})
}

func (h *DoctorHandler) GetAllDoctor(ctx *gin.Context) {
	query := dto.DoctorFilter{}

	err := ctx.ShouldBindQuery(&query)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	queryEntity := query.ToDoctorFilterEntity()
	doctors, err := h.doctorUseCase.GetDoctorList(ctx, queryEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	doctorRes := dto.DoctorListPageResponse{
		Pagination: (*dto.PaginationResponse)(&doctors.Pagination),
		Data:       dto.ToDoctorListResponse(doctors),
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    constant.ResponseOkMsg,
		Pagination: doctorRes.Pagination,
		Data:       doctorRes.Data,
	})

}

func (h *DoctorHandler) UpdateOneDoctor(ctx *gin.Context) {

	isDoctor := checkDoctor(ctx)
	if !isDoctor {
		isAdmin := checkAdmin(ctx)
		if !isAdmin {
			ctx.Error(apperror.ErrForbiddenAccess(nil))
			return
		}
	}

	body := dto.DoctorUpdateRequest{}
	err := ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	var idParam dto.DoctorIdParam
	err = ctx.ShouldBindUri(&idParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	file, FileHeader, err := ctx.Request.FormFile(constant.AvatarURLFormKey)
	isEmpty := body == dto.DoctorUpdateRequest{}
	if isEmpty && file == nil {
		ctx.Error(apperror.ErrInvalidReq(nil))
		return
	}
	if file != nil {
		if err != nil {
			ctx.Error(apperror.ErrInvalidReq(err))
			return
		}
		IsValidImageUploaded := appvalidator.IsValidImageUploaded(int(FileHeader.Size), FileHeader.Filename)
		if !IsValidImageUploaded {
			ctx.Error(apperror.ErrImgUploadInvalid(nil))
			return
		}
		defer file.Close()
	}

	doctorId, err := strconv.Atoi(idParam.Id)
	if err != nil {
		ctx.Error(apperror.NewInternal(err))
		return
	}
	doctor, err := h.doctorUseCase.UpdateOneDoctor(ctx, body.ToDoctorUpdateBody(file), int64(doctorId))
	if err != nil || doctor == nil {
		ctx.Error(err)
		return
	}
	res := dto.ToDoctorDetailResponse(doctor)

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseCategoryUpdatedMsg,
		Data:    res,
	})
}

func checkDoctor(ctx *gin.Context) bool {
	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if role != constant.RoleDoctor || role == "" {
		return false
	}
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
		return false
	}
	return true
}
