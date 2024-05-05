package usecase

import (
	"context"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type CartUsecase interface {
	Bulk(ctx context.Context, cart entity.Cart) error
	GetCartDetails(ctx context.Context, authenticationId int64) (*entity.Cart, error)
	UpdateOneCartItemQuantity(ctx context.Context, cartItem *entity.CartItem) error
	DeleteOneCartItem(ctx context.Context, cartItem *entity.CartItem) error
}

type cartUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewCartUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *cartUsecaseImpl {
	return &cartUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *cartUsecaseImpl) Bulk(ctx context.Context, cart entity.Cart) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		cr := rs.CartRepository()
		ur := rs.UserRepository()
		pr := rs.ProductRepository()
		prr := rs.PrescriptionRepository()
		prir := rs.PrescriptionItemRepository()

		userId, err := ur.FindUserIdByAuthId(ctx, cart.User.Authentication.Id)
		if err != nil {
			return nil, err
		}

		for _, c := range cart.Items {
			c.UserId = userId

			isProductExist, err := pr.IsProductExistById(ctx, c.Product.Id)
			if err != nil {
				return nil, err
			}

			if !isProductExist {
				return nil, apperror.NewProductNotFound(apperror.ErrStlNotFound)
			}

			isPrescriptionRequired, err := pr.IsPrescriptionRequired(ctx, c.Product.Id)
			if err != nil {
				return nil, err
			}

			if isPrescriptionRequired {
				if c.PrescriptionId == nil {
					return nil, apperror.ErrPrescriptionRequired(apperror.ErrStlBadRequest, c.Product.Id)
				}

				isPrescriptionExist, err := prr.IsPrescriptionExistByIdAndUserId(ctx, entity.Prescription{
					Id: *c.PrescriptionId, User: entity.User{Id: userId},
				})
				if err != nil {
					return nil, err
				}

				pi := entity.PrescriptionItem{
					Prescription: entity.Prescription{Id: *c.PrescriptionId},
					Product:      entity.ProductDetail{Id: c.Product.Id},
				}

				if !isPrescriptionExist {
					return nil, apperror.ErrPrescriptionNotExist(apperror.ErrStlNotFound)
				}

				isPrescriptionItemExist, err := prir.IsPrescriptionItemExist(ctx, pi)
				if err != nil {
					return nil, err
				}

				if !isPrescriptionItemExist {
					return nil, apperror.ErrPrescriptionItemNotExist(apperror.ErrStlNotFound)
				}

				amountByPrescription, err := prir.FindAmount(ctx, pi)
				if err != nil {
					return nil, err
				}

				c.Quantity = amountByPrescription
			}

			isItemExist, err := cr.IsItemExistInCart(ctx, c)
			if err != nil {
				return nil, err
			}

			if isItemExist {
				err := cr.UpdateOneCartItemQuantity(ctx, c)
				if err != nil {
					return nil, err
				}
			} else {
				err := cr.CreateOneCartItem(ctx, c)
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

func (u *cartUsecaseImpl) GetCartDetails(ctx context.Context, authenticationId int64) (*entity.Cart, error) {
	ur := u.repoStore.UserRepository()
	cr := u.repoStore.CartRepository()

	userId, err := ur.FindUserIdByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	hasActiveAddress, err := ur.HasActiveAddress(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	if !hasActiveAddress {
		return nil, apperror.ErrAddressNotFound(apperror.ErrStlNotFound)
	}

	cart, err := cr.FindCartDetails(ctx, *userId)
	if err != nil {
		return nil, err
	}

	for _, item := range cart.Items {
		if item.PharmacyProduct.Price != nil {
			cart.Subtotal += *item.PharmacyProduct.Price * *item.Quantity
		}
	}

	cart.User.Id = userId

	return cart, nil
}

func (u *cartUsecaseImpl) UpdateOneCartItemQuantity(ctx context.Context, cartItem *entity.CartItem) error {
	ur := u.repoStore.UserRepository()
	cr := u.repoStore.CartRepository()

	userId, err := ur.FindUserIdByAuthId(ctx, cartItem.AuthenticationId)
	if err != nil {
		return err
	}

	cartItem.UserId = userId

	isItemExist, err := cr.IsItemExistInCart(ctx, cartItem)
	if err != nil {
		return err
	}

	if !isItemExist {
		return apperror.NewProductNotFound(apperror.ErrStlNotFound)
	}

	err = cr.UpdateOneCartItemQuantity(ctx, cartItem)
	if err != nil {
		return err
	}

	return nil
}

func (u *cartUsecaseImpl) DeleteOneCartItem(ctx context.Context, cartItem *entity.CartItem) error {
	cr := u.repoStore.CartRepository()
	ur := u.repoStore.UserRepository()

	userId, err := ur.FindUserIdByAuthId(ctx, cartItem.AuthenticationId)
	if err != nil {
		return err
	}

	cartItem.UserId = userId

	err = cr.DeleteOneCartItem(ctx, cartItem)
	if err != nil {
		return err
	}

	return nil
}
