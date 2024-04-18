package handler

import (
	"net/http"
	"obatin/apperror"
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
