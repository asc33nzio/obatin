package usecase

import (
	"context"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
	"obatin/util"
)

type UserUsecase interface {
	GetUserDetails(ctx context.Context, authenticationId int64) (*entity.User, error)
	UpdateUserDetails(ctx context.Context, userUpdated *entity.UpdateUser) error
}

type userUsecaseImpl struct {
	repoStore        repository.RepoStore
	config           *config.Config
	cloudinaryUpload util.CloudinaryItf
}

func NewUserUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
	cloudinaryUpload util.CloudinaryItf,
) *userUsecaseImpl {
	return &userUsecaseImpl{
		repoStore:        repoStore,
		config:           config,
		cloudinaryUpload: cloudinaryUpload,
	}
}

func (u *userUsecaseImpl) GetUserDetails(ctx context.Context, authenticationId int64) (*entity.User, error) {
	ur := u.repoStore.UserRepository()

	isUserExist, err := ur.IsUserExistByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	if !isUserExist {
		return nil, apperror.ErrUserNotFound(nil)
	}

	user, err := ur.FindUserDetailsByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *userUsecaseImpl) UpdateUserDetails(ctx context.Context, userUpdated *entity.UpdateUser) error {
	ur := u.repoStore.UserRepository()
	ar := u.repoStore.AddressRepository()

	if userUpdated.AvatarImage != nil {
		uploadUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, userUpdated.AvatarImage)
		if err != nil {
			return apperror.NewInternal(err)
		}

		userUpdated.AvatarUrl = &uploadUrl
	}

	if userUpdated.ActiveAddressId != nil {
		userId, err := ur.FindUserIdByAuthId(ctx, userUpdated.AuthenticationId)
		if err != nil {
			return err
		}

		isAddressExist, err := ar.IsAddressExist(ctx, &entity.Address{Id: userUpdated.ActiveAddressId, UserId: userId})
		if err != nil {
			return err
		}

		if !isAddressExist {
			return apperror.ErrAddressNotFound(nil)
		}
	}

	err := ur.UpdateOneUserDetails(ctx, userUpdated)
	if err != nil {
		return err
	}

	return nil
}
