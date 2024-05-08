package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/constant"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type CartHandler struct {
	cartUsecase usecase.CartUsecase
}

func NewCartHandler(cartUsecase usecase.CartUsecase) *CartHandler {
	return &CartHandler{
		cartUsecase: cartUsecase,
	}
}

func (h *CartHandler) GetCartDetails(ctx *gin.Context) {
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

	cart, err := h.cartUsecase.GetCartDetails(ctx, authenticationId)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetCartRes(cart)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *CartHandler) Bulk(ctx *gin.Context) {
	body := dto.UpdateCartReq{}

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
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(nil))
		return
	}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.cartUsecase.Bulk(ctx, body.ToCart(&authenticationId))
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: constant.ResponseCartUpdatedMsg,
	})
}

func (h *CartHandler) UpdateOneCartItemQuantity(ctx *gin.Context) {
	body := dto.UpdateOneCartItemReq{}

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
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(nil))
		return
	}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.cartUsecase.UpdateOneCartItem(ctx, body.ToCartItem(&authenticationId))
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseCartUpdatedMsg,
	})
}

func (h *CartHandler) DeleteOneCartItem(ctx *gin.Context) {
	body := dto.DeleteOneCartItemReq{}

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
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(nil))
		return
	}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.cartUsecase.DeleteOneCartItem(ctx, body.ToCartItem(&authenticationId))
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseCartItemDeletedMsg,
	})
}

func (h *CartHandler) Checkout(ctx *gin.Context) {
	body := dto.CartCheckoutReq{}

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
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(nil))
		return
	}

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	id, err := h.cartUsecase.Checkout(ctx, body.ToCartCheckout(authenticationId))
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseCartCheckoutMsg,
		Data:    dto.CartCheckoutRes{PaymentId: *id},
	})
}
