package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type ManufacturerHandler struct {
	manufacturerUsecase usecase.ManufacturerUsecase
}

func NewManufacturerHandler(manufacturerUseCase usecase.ManufacturerUsecase) *ManufacturerHandler {
	return &ManufacturerHandler{
		manufacturerUsecase: manufacturerUseCase,
	}
}

func (h *ManufacturerHandler) GetAllManufacturers(ctx *gin.Context) {
	query := dto.ManufacturerFilter{}

	err := ctx.ShouldBindQuery(&query)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	queryEntity := query.ToManufacturerFilterEntity()
	manufacturers, err := h.manufacturerUsecase.GetAllManufacturer(ctx, *queryEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	productsRes := dto.ManufacturerListPageResponse{
		Pagination: (*dto.PaginationResponse)(&manufacturers.Pagination),
		Data:       dto.ToManufacturerListResponse(manufacturers),
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    appconstant.ResponseOkMsg,
		Pagination: productsRes.Pagination,
		Data:       productsRes.Data,
	})
}
