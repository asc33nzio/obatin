package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type PartnerHandler struct {
	partnerUsecase usecase.PartnerUsecase
}

func NewPartnerHandler(partnerUsecase usecase.PartnerUsecase) *PartnerHandler {
	return &PartnerHandler{
		partnerUsecase: partnerUsecase,
	}
}

func (h *PartnerHandler) RegisterPartner(ctx *gin.Context) {

	file, FileHeader, err := ctx.Request.FormFile(appconstant.LogoJSONTag)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	isValidFileUploaded := appvalidator.IsValidImageUploaded(int(FileHeader.Size), FileHeader.Filename)

	if !isValidFileUploaded {
		ctx.Error(apperror.ErrFileLogoUploadInvalid(apperror.ErrStlUploadFileInvalid))
		return
	}
	defer file.Close()

	body := dto.PartnerRegisterReq{
		Email:    ctx.Request.FormValue(appconstant.EmailJSONTag),
		Logo:     file,
		Password: ctx.Request.FormValue(appconstant.PasswordJSONTag),
		Name:     ctx.Request.FormValue(appconstant.NameJSONTag),
	}
	err = ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.partnerUsecase.CreateNewPartner(ctx, body.ToPartner())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: appconstant.ResponseRegisterMsg,
	})
}

func (h *PartnerHandler) GetAllPartner(ctx *gin.Context) {
	query := dto.PartnerFilter{}

	err := ctx.ShouldBindQuery(&query)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	queryEntity := query.ToPartnerFilterEntity()
	partners, err := h.partnerUsecase.GetAllPartner(ctx, queryEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	partnersRes := dto.PartnerListPageResponse{
		Pagination: (*dto.PaginationResponse)(&partners.Pagination),
		Data:       dto.ToPartnerListResponse(partners),
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    appconstant.ResponseOkMsg,
		Pagination: partnersRes.Pagination,
		Data:       partnersRes.Data,
	})
}

func (h *PartnerHandler) UpdateOnePartner(ctx *gin.Context) {

	body := dto.PartnerUpdateReq{}

	err := ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	var idParam dto.PartnerIdParam
	err = ctx.ShouldBindUri(&idParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	file, FileHeader, err := ctx.Request.FormFile(appconstant.LogoJSONTag)
	if file != nil {
		if err != nil {
			ctx.Error(apperror.ErrInvalidReq(err))
			return
		}
		IsValidLogoUploaded := appvalidator.IsValidImageUploaded(int(FileHeader.Size), FileHeader.Filename)
		if !IsValidLogoUploaded {
			ctx.Error(apperror.ErrImgUploadInvalid(nil))
			return
		}
		defer file.Close()
	}

	partner, err := h.partnerUsecase.UpdateOnePartner(ctx, body.ToPartnerUpdateBodyEntity(file), idParam.Id)
	if err != nil {
		ctx.Error(err)
		return
	}
	res := dto.ToPartnerResponse(partner)

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponsePartnerUpdateMsg,
		Data:    res,
	})
}

func (h *PartnerHandler) GetPartnerDetailById(ctx *gin.Context) {
	var idParam dto.PartnerIdParam
	err := ctx.ShouldBindUri(&idParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	partner, err := h.partnerUsecase.GetPartnerById(ctx, idParam.Id)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToPartnerResponse(partner)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}
