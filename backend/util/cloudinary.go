package util

import (
	"context"
	"obatin/apperror"
	"obatin/config"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
)

type CloudinaryItf interface {
	ImageUploadHelper(ctx context.Context, input interface{}) (string, error)
}

type CloudinaryUpload struct {
	config *config.Config
}

func NewCloudinaryUpload(config *config.Config) *CloudinaryUpload {
	return &CloudinaryUpload{
		config: config,
	}
}

func (cu *CloudinaryUpload) ImageUploadHelper(ctx context.Context, input interface{}) (string, error) {
	config, err := config.NewConfig()
	if err != nil {
		return "", apperror.ErrStlUploadFileToCloudinary
	}

	cld, err := cloudinary.NewFromParams(config.CloudinaryCloudName(), config.CloudinaryKey(), config.CloudinarySecret())
	if err != nil {
		return "", err
	}

	uploadParam, err := cld.Upload.Upload(ctx, input, uploader.UploadParams{Folder: config.CloudinaryFolder()})
	if err != nil {
		return "", err
	}
	return uploadParam.SecureURL, nil
}
