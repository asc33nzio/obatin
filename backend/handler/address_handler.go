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

type AddressHandler struct {
	addressUsecase usecase.AddressUsecase
}

func NewAddressHandler(addressUsecase usecase.AddressUsecase) *AddressHandler {
	return &AddressHandler{
		addressUsecase: addressUsecase,
	}
}

func (h *AddressHandler) CreateOneAddress(ctx *gin.Context) {
	body := dto.CreateAddressReq{}
	pathParam := dto.UserAuthIdUriParam{}
	var authenticationId int64

	err := ctx.ShouldBindUri(&pathParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationId = pathParam.Id

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
		return
	}

	if role != constant.RoleAdmin {
		if role != constant.RoleUser {
			ctx.Error(apperror.ErrForbiddenAccess(nil))
			return
		}

		authenticationId, ok = ctx.Value(constant.AuthenticationIdKey).(int64)
		if !ok {
			ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
			return
		}
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

	err = ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.addressUsecase.CreateOneAddress(ctx, body.ToAddress(authenticationId))
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: constant.ResponseAddressCreatedMsg,
	})
}

func (h *AddressHandler) UpdateOneAddress(ctx *gin.Context) {
	body := dto.UpdateAddressReq{}
	authIdParam := dto.UserAuthIdUriParam{}
	addressIdParam := dto.AddressIdUriParam{}
	var authenticationId int64

	err := ctx.ShouldBindUri(&authIdParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = ctx.ShouldBindUri(&addressIdParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationId = authIdParam.Id

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
		return
	}

	if role != constant.RoleAdmin {
		if role != constant.RoleUser {
			ctx.Error(apperror.ErrForbiddenAccess(nil))
			return
		}

		authenticationId, ok = ctx.Value(constant.AuthenticationIdKey).(int64)
		if !ok {
			ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
			return
		}
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

	err = ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = h.addressUsecase.UpdateOneAddress(ctx, body.ToAddress(authenticationId, addressIdParam.Id))
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseAddressUpdatedMsg,
	})
}

func (h *AddressHandler) DeleteOneAddress(ctx *gin.Context) {
	authIdParam := dto.UserAuthIdUriParam{}
	addressIdParam := dto.AddressIdUriParam{}
	var authenticationId int64

	err := ctx.ShouldBindUri(&authIdParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = ctx.ShouldBindUri(&addressIdParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationId = authIdParam.Id

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
		return
	}

	if role != constant.RoleAdmin {
		if role != constant.RoleUser {
			ctx.Error(apperror.ErrForbiddenAccess(nil))
			return
		}

		authenticationId, ok = ctx.Value(constant.AuthenticationIdKey).(int64)
		if !ok {
			ctx.Error(apperror.NewInternal(apperror.ErrInterfaceCasting))
			return
		}
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

	err = h.addressUsecase.DeleteOneAddress(ctx, &entity.Address{
		AuthenticationId: &authenticationId, Id: &addressIdParam.Id,
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: constant.ResponseAddressDeletedMsg,
	})
}
