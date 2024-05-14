package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/dto"
	"obatin/usecase"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userUsecase usecase.UserUsecase
}

func NewUserHandler(userUsecase usecase.UserUsecase) *UserHandler {
	return &UserHandler{
		userUsecase: userUsecase,
	}
}

func (h *UserHandler) GetUserDetails(ctx *gin.Context) {
	pathParam := dto.UserAuthIdUriParam{}
	var authenticationId int64

	err := ctx.ShouldBindUri(&pathParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationId = pathParam.Id

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleAdmin {
		if role != appconstant.RoleUser {
			ctx.Error(apperror.ErrForbiddenAccess(nil))
			return
		}

		authenticationId, ok = ctx.Value(appconstant.AuthenticationIdKey).(int64)
		if !ok {
			ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
			return
		}
	}

	user, err := h.userUsecase.GetUserDetails(ctx, authenticationId)
	if err != nil {
		ctx.Error(err)
		return
	}

	res := dto.ToGetUserRes(user)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}

func (h *UserHandler) UpdateUserDetails(ctx *gin.Context) {
	form := dto.UserUpdateDetailsFormReq{}
	pathParam := dto.UserAuthIdUriParam{}
	var authenticationId int64

	err := ctx.ShouldBind(&form)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	err = ctx.ShouldBindUri(&pathParam)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	authenticationId = pathParam.Id

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
		return
	}

	if role != appconstant.RoleAdmin {
		if role != appconstant.RoleUser {
			ctx.Error(apperror.ErrForbiddenAccess(nil))
			return
		}

		authenticationId, ok = ctx.Value(appconstant.AuthenticationIdKey).(int64)
		if !ok {
			ctx.Error(apperror.NewInternal(apperror.ErrStlInterfaceCasting))
			return
		}
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

	file, fileHeader, err := ctx.Request.FormFile(appconstant.AvatarImageFormKey)
	if err != nil && err != http.ErrMissingFile {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	if file != nil && fileHeader != nil {
		isValidFileUploaded := appvalidator.IsValidImageUploaded(int(fileHeader.Size), fileHeader.Filename)

		if !isValidFileUploaded {
			ctx.Error(apperror.ErrImgUploadInvalid(nil))
			return
		}
		defer file.Close()
	}

	form.AvatarImage = file
	form.AuthenticationId = authenticationId

	err = h.userUsecase.UpdateUserDetails(ctx, form.ToUpdateUser())
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseUpdateUserMsg,
	})
}
