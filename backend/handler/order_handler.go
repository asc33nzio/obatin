package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/constant"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	orderUsecase usecase.OrderUsecase
}

func NewOrderHandler(orderUsecase usecase.OrderUsecase) *OrderHandler {
	return &OrderHandler{
		orderUsecase: orderUsecase,
	}
}

func (h *OrderHandler) GetUserOrders(ctx *gin.Context) {
	var params dto.UserOrdersFilter

	err := ctx.ShouldBindQuery(&params)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	isVerified, ok := ctx.Value(constant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	orders, err := h.orderUsecase.GetUserOrders(ctx, authenticationId, params.ToUserOrdersFilterEntity())
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToUserOrdersRes(orders.Orders)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    constant.ResponseOkMsg,
		Pagination: (*dto.PaginationResponse)(&orders.Pagination),
		Data:       res,
	})
}
