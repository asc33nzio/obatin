package handler

import (
	"net/http"
	"obatin/apperror"
	"obatin/constant"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type PharmacyHandler struct {
	pharmacyUsecase usecase.PharmacyUsecase
}

func NewPharmacyHandler(pharmacyUseCase usecase.PharmacyUsecase) *PharmacyHandler {
	return &PharmacyHandler{
		pharmacyUsecase: pharmacyUseCase,
	}
}

func (h *PharmacyHandler) GetAllPharmacy(ctx *gin.Context) {
	query := dto.PharmacyFilter{}

	err := ctx.ShouldBindQuery(&query)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}
	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}
	if role != constant.RoleAdmin && role != constant.RoleManager || role == "" {
		ctx.Error(apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess))
		return
	}

	queryEntity := query.ToEntityFilter()
	pharmacies, err := h.pharmacyUsecase.GetAllPharmacies(ctx, *queryEntity)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message:    constant.ResponseOkMsg,
		Pagination: (*dto.PaginationResponse)(&pharmacies.Pagination),
		Data:       dto.ToPharmacyListResponse(pharmacies),
	})
}
