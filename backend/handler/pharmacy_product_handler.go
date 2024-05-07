package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/constant"
	"obatin/dto"
	"obatin/entity"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type PharmacyProductHandler struct {
	pharmacyProductUsecase usecase.PharmacyProductUsecase
}

func NewPharmacyProductHandler(pharmacyProductUsecase usecase.PharmacyProductUsecase) *PharmacyProductHandler {
	return &PharmacyProductHandler{
		pharmacyProductUsecase: pharmacyProductUsecase,
	}
}

func (h *PharmacyProductHandler) GetNearbyPharmacies(ctx *gin.Context) {
	var uriParam dto.ProductIdUriParam
	err := ctx.ShouldBindUri(&uriParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	nearbyPharmacies, err := h.pharmacyProductUsecase.GetPharmaciesWithin25kmByProductId(ctx, uriParam.Id)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetNearbyPharmaciesRes(nearbyPharmacies)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *PharmacyProductHandler) TotalStockPerPartner(ctx *gin.Context) {
	var body dto.TotalStockPerPartnerReq
	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	isVerified, ok := ctx.Value(constant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
		return
	}

	if !isVerified {
		ctx.Error(apperror.ErrNoAccessAccountNotVerified(nil))
		return
	}

	totalStock, err := h.pharmacyProductUsecase.TotalStockPerPartner(ctx, body.ToPharmacyProduct())
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToTotalStockPerPartnerRes(&entity.PharmacyProduct{
		Product:    entity.ProductDetail{Id: body.ProductId},
		Pharmacy:   entity.Pharmacy{PartnerId: &body.PartnerId},
		TotalStock: *totalStock,
	})
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseOkMsg,
		Data:    res,
	})
}
