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
		Message:    appconstant.ResponseOkMsg,
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
	var forSales bool

	role, _ := ctx.Value(appconstant.AuthenticationRole).(string)
	if role == appconstant.RoleAdmin {
		forSales = true
	}

	res := dto.ToProductDetailResponse(product, forSales)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
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

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleAdmin || role == "" {
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
		Message: appconstant.ResponseOkMsg,
	})

}

func (h *ProductHandler) CreateProduct(ctx *gin.Context) {
	body := dto.AddProductRequest{}

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleAdmin || role == "" {
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
		Message: appconstant.ResponseOkMsg,
	})
}
