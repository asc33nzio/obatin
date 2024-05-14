package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/dto"
	"obatin/entity"
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
	var params dto.OrdersFilter

	err := ctx.ShouldBindQuery(&params)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
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
		Message:    appconstant.ResponseOkMsg,
		Pagination: (*dto.PaginationResponse)(&orders.Pagination),
		Data:       res,
	})
}

func (h *OrderHandler) GetAllOrders(ctx *gin.Context) {
	var params dto.OrdersFilter

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleAdmin {
		if role != appconstant.RoleManager {
			ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
			return
		}
	}

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	err := ctx.ShouldBindQuery(&params)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	orders, err := h.orderUsecase.GetAllOrders(ctx, params.ToUserOrdersFilterEntity())
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToUserOrdersRes(orders.Orders)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    appconstant.ResponseOkMsg,
		Pagination: (*dto.PaginationResponse)(&orders.Pagination),
		Data:       res,
	})
}

func (h *OrderHandler) UpdateOrderStatus(ctx *gin.Context) {
	var body dto.UpdateOrderStatusReq
	var uriParams dto.OrderIdUriParams

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleAdmin {
		if role != appconstant.RoleManager && role != appconstant.RoleUser {
			ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
			return
		}
	}

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(apperror.ErrStlForbiddenAccess))
		return
	}

	err := ctx.ShouldBindUri(&uriParams)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	if role == appconstant.RoleUser {
		if body.Status != appconstant.OrderConfirmed {
			ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
			return
		}
	}

	err = h.orderUsecase.UpdateOrderStatus(ctx, &entity.Order{
		Id:     &uriParams.Id,
		Status: body.Status,
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
	})
}
