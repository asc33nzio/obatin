package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/dto"
	"obatin/entity"
	"obatin/usecase"
	"strconv"

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
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *PharmacyProductHandler) GetAllPartnerPharmacyProduct(ctx *gin.Context) {
	query := dto.PharmacyProductFilter{}

	err := ctx.ShouldBindQuery(&query)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}
	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleManager || role == "" {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	queryEntity := query.ToPharmacyProductFilterEntity()
	products, err := h.pharmacyProductUsecase.GetPharmacyProductByPartner(ctx, queryEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	productsRes := dto.PharmacyProductListPageResponse{
		Pagination: (*dto.PaginationResponse)(&products.Pagination),
		Data:       dto.ToPharmacyProductResponse(products.Products),
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    appconstant.ResponseOkMsg,
		Pagination: productsRes.Pagination,
		Data:       productsRes.Data,
	})
}

func (h *PharmacyProductHandler) TotalStockPerPartner(ctx *gin.Context) {
	var body dto.TotalStockPerPartnerReq
	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	isVerified, ok := ctx.Value(appconstant.IsVerifiedKey).(bool)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
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
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *PharmacyProductHandler) CreateOnePharmacyProduct(ctx *gin.Context) {
	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleManager || role == "" {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	body := dto.CreatePharmacyProduct{}
	err := ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}
	err = h.pharmacyProductUsecase.CreatePharmacyProduct(ctx, *body.ToEntityPharmacyProductFromCreate())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: appconstant.ResponsePharmacyProductCreatedMsg,
	})
}

func (h *PharmacyProductHandler) UpdatePharmacyProduct(ctx *gin.Context) {
	var ppParam dto.PharmacyProductParam
	err := ctx.ShouldBindUri(&ppParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleManager || role == "" {
		ctx.Error(apperror.ErrForbiddenAccess(nil))
		return
	}
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	body := dto.UpdatePharmacyProductReq{}
	err = ctx.ShouldBind(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	if body.UpdateType == appconstant.UpdatePharmacyProductTypeStockMutation {
		if body.SourcePharmacyProductId == nil || body.Delta == nil {
			ctx.Error(apperror.ErrInvalidReq(apperror.ErrStlIncompleteRequest))
			return
		}
	}
	if body.UpdateType == appconstant.UpdatePharmacyProductTypeManualMutation {
		if body.Delta == nil || body.IsAddition == nil {
			ctx.Error(apperror.ErrInvalidReq(apperror.ErrStlIncompleteRequest))
			return
		}
	}
	bodyEntity := body.ToEntityUpdatePharmacyProduct()
	targetPPIdint, err := strconv.Atoi(ppParam.PharmacyProductId)
	if err != nil {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}
	ptrTargetPPIdInt64 := int64(targetPPIdint)
	bodyEntity.TargetPharmacyProductId = &ptrTargetPPIdInt64

	err = h.pharmacyProductUsecase.UpdatePharmacyProduct(ctx, *bodyEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
	})
}
