package usecase

import (
	"context"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type AddressUsecase interface {
	CreateOneAddress(ctx context.Context, a *entity.Address) error
	UpdateOneAddress(ctx context.Context, a *entity.Address) error
	DeleteOneAddress(ctx context.Context, a *entity.Address) error
}

type addressUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewAddressUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *addressUsecaseImpl {
	return &addressUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *addressUsecaseImpl) CreateOneAddress(ctx context.Context, a *entity.Address) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ur := rs.UserRepository()
		ar := rs.AddressRepository()

		userId, err := ur.FindUserIdByAuthId(ctx, *a.AuthenticationId)
		if err != nil {
			return nil, err
		}

		a.UserId = userId

		address, err := ar.CreateOneAddress(ctx, a)
		if err != nil {
			return nil, err
		}

		hasActiveAddress, err := ur.HasActiveAddress(ctx, *a.AuthenticationId)
		if err != nil {
			return nil, err
		}

		if !hasActiveAddress {
			err = ur.UpdateOneUserDetails(ctx, &entity.UpdateUser{
				ActiveAddressId:  address.Id,
				AuthenticationId: *a.AuthenticationId,
			})
			if err != nil {
				return nil, err
			}
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}

func (u *addressUsecaseImpl) UpdateOneAddress(ctx context.Context, a *entity.Address) error {
	ar := u.repoStore.AddressRepository()
	ur := u.repoStore.UserRepository()

	userId, err := ur.FindUserIdByAuthId(ctx, *a.AuthenticationId)
	if err != nil {
		return err
	}

	a.UserId = userId

	isAddressExist, err := ar.IsAddressExist(ctx, a)
	if err != nil {
		return err
	}

	if !isAddressExist {
		return apperror.ErrAddressNotFound(nil)
	}

	err = ar.UpdateOneAddress(ctx, a)
	if err != nil {
		return err
	}

	return nil
}

func (u *addressUsecaseImpl) DeleteOneAddress(ctx context.Context, a *entity.Address) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ur := rs.UserRepository()
		ar := rs.AddressRepository()

		user, err := ur.FindUserByAuthId(ctx, *a.AuthenticationId)
		if err != nil {
			return nil, err
		}

		a.UserId = user.Id

		isAddressExist, err := ar.IsAddressExist(ctx, a)
		if err != nil {
			return nil, err
		}

		if !isAddressExist {
			return nil, apperror.ErrAddressNotFound(nil)
		}

		err = ar.DeleteOneAddress(ctx, a)
		if err != nil {
			return nil, err
		}

		if *a.Id == *user.ActiveAddress.Id {
			existedAddressId, _ := ar.FindOneAddressIdByUserId(ctx, *user.Id)
			if existedAddressId == nil {
				err = ur.RemoveActiveAddressId(ctx, *a.AuthenticationId)
				if err != nil {
					return nil, err
				}
			} else {
				err = ur.UpdateOneUserDetails(ctx, &entity.UpdateUser{ActiveAddressId: existedAddressId})
				if err != nil {
					return nil, err
				}
			}
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}
