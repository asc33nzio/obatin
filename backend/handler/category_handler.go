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

type CategoryHandler struct {
	categoryUsecase usecase.CategoryUsecase
}

func NewCategoryHandler(categoryUseCase usecase.CategoryUsecase) *CategoryHandler {
	return &CategoryHandler{
		categoryUsecase: categoryUseCase,
	}
}

func (h *CategoryHandler) GetAllCategory(ctx *gin.Context) {

	categories, err := h.categoryUsecase.GetAllCategory(ctx)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
		Data:    categories,
	})
}

func checkAdmin(ctx *gin.Context) bool {
	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleAdmin || role == "" {
		return false
	}
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return false
	}
	return true
}

func (h *CategoryHandler) CreateOneCategory(ctx *gin.Context) {

	isAdmin := checkAdmin(ctx)
	if !isAdmin {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}

	body := dto.CategoryRequest{}

	err := ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	file, FileHeader, err := ctx.Request.FormFile(appconstant.ImageUrlFormKey)
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

	category, err := h.categoryUsecase.CreateOneCategory(ctx, body.ToCategoryRequestBodyEntity(file))
	if err != nil || category == nil {
		ctx.Error(err)
		return
	}
	res := dto.ToCategoryResponse(category)

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: appconstant.ResponseCategoryCreatedMsg,
		Data:    res,
	})

}

func (h *CategoryHandler) UpdateOneCategory(ctx *gin.Context) {

	isAdmin := checkAdmin(ctx)
	if !isAdmin {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}

	body := dto.CategoryUpdateRequest{}
	err := ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	var slugParam dto.CategorySlugParam
	err = ctx.ShouldBindUri(&slugParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	file, FileHeader, err := ctx.Request.FormFile(appconstant.ImageUrlFormKey)
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
	if body.Slug != nil && *body.Slug == slugParam.Slug {
		ctx.Error(apperror.ErrDuplicateSlug(nil))
		return
	}

	category, err := h.categoryUsecase.UpdateOneCategory(ctx, body.ToCategoryUpdateBodyEntity(file), slugParam.Slug)
	if err != nil || category == nil {
		ctx.Error(err)
		return
	}
	res := dto.ToCategoryResponse(category)

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseCategoryUpdatedMsg,
		Data:    res,
	})
}

func (h *CategoryHandler) DeleteOneCategoryBySlug(ctx *gin.Context) {

	isAdmin := checkAdmin(ctx)
	if !isAdmin {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}

	var slugParam dto.CategorySlugParam
	err := ctx.ShouldBindUri(&slugParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.categoryUsecase.DeleteOneCategoryBySlug(ctx, slugParam.Slug)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
	})
}
