package handler

import (
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/dto"
	"obatin/usecase"
	"strings"

	"github.com/gin-gonic/gin"
)

type CloudinaryHandler struct {
	cloudinaryUseCase usecase.CloudinaryUseCase
}

func NewCloudinaryHandler(cloudinaryUseCase usecase.CloudinaryUseCase) *CloudinaryHandler {
	return &CloudinaryHandler{
		cloudinaryUseCase: cloudinaryUseCase,
	}
}

func (h *CloudinaryHandler) UploadImageOrFileToCloudinary(ctx *gin.Context) {
	var urlImage strings.Builder
	var urlFile strings.Builder

	image, ImageHeader, err := ctx.Request.FormFile(appconstant.ImageUrlFormKey)
	if err != nil {
		if err != http.ErrMissingFile {
			ctx.Error(apperror.ErrInvalidReq(err))
			return
		}
	}
	file, FileHeader, err := ctx.Request.FormFile(appconstant.FileUrlFormKey)
	if err != nil {
		if err != http.ErrMissingFile {
			ctx.Error(apperror.ErrInvalidReq(err))
			return
		}
	}

	if file != nil {
		IsValidFileUploaded := appvalidator.IsValidCertificateFileUploaded(int(FileHeader.Size), FileHeader.Filename)
		if !IsValidFileUploaded {
			ctx.Error(apperror.ErrImgUploadInvalid(nil))
			return
		}
		defer file.Close()

		if file != nil {
			fileUrl, err := h.cloudinaryUseCase.UploadImageToCloudinary(ctx, file)
			if err != nil {
				ctx.Error(err)
				return
			}
			urlFile.WriteString(fileUrl)
		}
	}

	if image != nil {
		IsValidImageUploaded := appvalidator.IsValidImageUploaded(int(ImageHeader.Size), ImageHeader.Filename)
		if !IsValidImageUploaded {
			ctx.Error(apperror.ErrImgUploadInvalid(nil))
			return
		}
		defer image.Close()

		imageUrl, err := h.cloudinaryUseCase.UploadImageToCloudinary(ctx, image)
		if err != nil {
			ctx.Error(err)
			return
		}

		urlImage.WriteString(imageUrl)
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Message: appconstant.ResponseSuccessUploadCloudinaryMsg,
		Data: dto.CloudinaryUrlRes{
			FileUrl:  urlFile.String(),
			ImageUrl: urlImage.String(),
		},
	})

}
