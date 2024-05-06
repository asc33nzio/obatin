package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/constant"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	productUsecase usecase.ProductUsecase
}

func NewProductHandler(productUseCase usecase.ProductUsecase) *ProductHandler {
	return &ProductHandler{
		productUsecase: productUseCase,
	}
}

func (h *ProductHandler) GetAllProducts(ctx *gin.Context) {
	query := dto.ProductFilter{}

	err := ctx.ShouldBindQuery(&query)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	queryEntity := query.ToProductFilterEntity()
	products, err := h.productUsecase.GetAllProducts(ctx, queryEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	productsRes := dto.ProductListPageResponse{
		Pagination: (*dto.PaginationResponse)(&products.Pagination),
		Data:       dto.ToProductListResponse(products),
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    constant.ResponseOkMsg,
		Pagination: productsRes.Pagination,
		Data:       productsRes.Data,
	})
}

func (h *ProductHandler) GetProductDetailBySlug(ctx *gin.Context) {
	var slugParam dto.ProductSlugParam
	err := ctx.ShouldBindUri(&slugParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	product, err := h.productUsecase.GetProductDetailBySlug(ctx, slugParam.Slug)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToProductDetailResponse(product)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *ProductHandler) UpdateProductDetaiBySlug(ctx *gin.Context) {
	var slugParam dto.ProductSlugParam
	err := ctx.ShouldBindUri(&slugParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	body := dto.UpdateProductRequest{}

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if role != constant.RoleAdmin || role == "" {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	err = ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	file, FileHeader, err := ctx.Request.FormFile(constant.ImageUrlFormKey)
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

	reqEntity, err := dto.ToEntityFromUpdateProductBody(body)
	if err != nil {
		ctx.Error(err)
		return
	}
	if file != nil {
		reqEntity.Image = &file
	}

	err = h.productUsecase.UpdateProductDetaiBySlug(ctx, *reqEntity, slugParam.Slug)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
	})

}

func (h *ProductHandler) CreateProduct(ctx *gin.Context) {
	body := dto.AddProductRequest{}

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if role != constant.RoleAdmin || role == "" {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	err := ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}
	file, FileHeader, err := ctx.Request.FormFile(constant.ImageUrlFormKey)
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

	reqEntity, err := dto.ToProductDetailFromInsertBody(body)
	if err != nil {

		ctx.Error(err)
		return
	}
	if file != nil {
		reqEntity.Image = &file
	}

	err = h.productUsecase.CreateProduct(ctx, *reqEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
	})
}
