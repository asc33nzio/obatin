package usecase

import (
	"context"
	"mime/multipart"
	"obatin/util"
)

type CloudinaryUseCase interface {
	UploadImageToCloudinary(ctx context.Context, image multipart.File) (string, error)
}

type cloudinaryUsecaseImpl struct {
	cloudinaryUpload util.CloudinaryItf
}

func NewCloudinaryUseCaseImpl(
	cloudinaryUpload util.CloudinaryItf,
) *cloudinaryUsecaseImpl {
	return &cloudinaryUsecaseImpl{
		cloudinaryUpload: cloudinaryUpload,
	}
}

func (u *cloudinaryUsecaseImpl) UploadImageToCloudinary(ctx context.Context, image multipart.File) (string, error) {
	imageUploadedUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, image)
	if err != nil {
		return "", err
	}
	
	return imageUploadedUrl, err
}
