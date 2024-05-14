package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type StockMovementHandler struct {
	stockMovementUsecase usecase.StockMovementUsecase
}

func NewStockMovementHandler(stockMovementUsecase usecase.StockMovementUsecase) *StockMovementHandler {
	return &StockMovementHandler{
		stockMovementUsecase: stockMovementUsecase,
	}
}

func (h *StockMovementHandler) GetAllStockMovements(ctx *gin.Context) {
	params := dto.StockMovementFilter{}

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleAdmin && role != appconstant.RoleManager || role == "" {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}

	err := ctx.ShouldBindQuery(&params)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	stockMovements, err := h.stockMovementUsecase.GetAllStockMovements(ctx, params.ToFilterEntity())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    appconstant.ResponseOkMsg,
		Pagination: (*dto.PaginationResponse)(&stockMovements.Pagination),
		Data:       dto.ToGetAllStockMovementRes(stockMovements.StockMovements),
	})
}
