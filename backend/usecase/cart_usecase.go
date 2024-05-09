package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type CartUsecase interface {
	Bulk(ctx context.Context, cart entity.Cart) error
	GetCart(ctx context.Context, authenticationId int64) (*entity.Cart, error)
	GetCartDetails(ctx context.Context, authenticationId int64) (*entity.Cart, error)
	UpdateOneCartItem(ctx context.Context, cartItem *entity.CartItem) error
	DeleteOneCartItem(ctx context.Context, cartItem *entity.CartItem) error
	Checkout(ctx context.Context, co *entity.CartCheckout) (*int64, error)
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

		hasActiveAddress, err := ur.HasActiveAddress(ctx, cart.User.Authentication.Id)
		if err != nil {
			return nil, err
		}

		if !hasActiveAddress {
			return nil, apperror.ErrAddressNotFound(apperror.ErrStlNotFound)
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
				err := cr.UpdateOneCartItem(ctx, c)
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

func (u *cartUsecaseImpl) GetCart(ctx context.Context, authenticationId int64) (*entity.Cart, error) {
	ur := u.repoStore.UserRepository()
	cr := u.repoStore.CartRepository()

	userId, err := ur.FindUserIdByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	cart, err := cr.FindCart(ctx, *userId)
	if err != nil {
		return nil, err
	}

	for _, item := range cart.Items {
		cart.Subtotal += item.Product.MaxPrice
	}

	cart.User.Id = userId

	return cart, nil
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

func (u *cartUsecaseImpl) UpdateOneCartItem(ctx context.Context, cartItem *entity.CartItem) error {
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

	err = cr.UpdateOneCartItem(ctx, cartItem)
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

func (u *cartUsecaseImpl) Checkout(ctx context.Context, co *entity.CartCheckout) (*int64, error) {
	ur := u.repoStore.UserRepository()

	userId, err := ur.FindUserIdByAuthId(ctx, co.User.Authentication.Id)
	if err != nil {
		return nil, err
	}

	co.User.Id = userId

	res, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ppr := rs.PharmacyProductRepository()
		smr := rs.StockMovementRepository()
		pr := rs.PaymentRepository()
		or := rs.OrderRepository()
		cr := rs.CartRepository()

		payment := &entity.Payment{
			User:          entity.User{Id: co.User.Id},
			PaymentMethod: appconstant.DefaultPaymentMethod,
			TotalPayment:  co.Payment.TotalPayment,
		}

		_, err := pr.CreateOnePayment(ctx, payment)
		if err != nil {
			return nil, err
		}

		for _, pc := range co.PharmaciesCart {
			pc.User.Id = userId
			pc.Payment.Id = payment.Id
			pc.NumberItems = len(pc.CartItems)
			_, err := or.CreateOneOrder(ctx, &pc)
			if err != nil {
				return nil, err
			}

			for _, ci := range pc.CartItems {
				stock, err := ppr.FindStockAndLockById(ctx, *ci.PharmacyProductId)
				if err != nil {
					return nil, err
				}

				currentStock := *stock
				currentPharmacyMutation := &entity.StockMovement{
					PharmacyProduct: entity.PharmacyProduct{Id: *ci.PharmacyProductId},
					MovementType:    appconstant.InternalStockMovementType,
					IsAddition:      true,
				}

				if *ci.Quantity > *stock {
					totalStock, err := ppr.FindTotalStockPerPartner(ctx, &entity.PharmacyProduct{
						Product:  entity.ProductDetail{Id: ci.Product.Id},
						Pharmacy: entity.Pharmacy{PartnerId: pc.Pharmacy.PartnerId},
					})
					if err != nil {
						return nil, err
					}

					if *ci.Quantity > *totalStock {
						return nil, apperror.ErrInsufficientStock(apperror.ErrStlBadRequest, ci.Product.Name)
					}

					nearbyPartners, err := ppr.FindNearbyPartner(ctx, &entity.PharmacyProduct{
						Product:  entity.ProductDetail{Id: ci.Product.Id},
						Pharmacy: entity.Pharmacy{Id: pc.Pharmacy.Id},
					})
					if err != nil {
						return nil, err
					}

					needed := *ci.Quantity - *stock
					index := 0
					for needed > 0 {
						pp := nearbyPartners[index]

						otherStock, err := ppr.FindStockAndLockById(ctx, pp.Id)
						if err != nil {
							return nil, err
						}

						otherPharmacyMutation := &entity.StockMovement{
							PharmacyProduct: entity.PharmacyProduct{Id: pp.Id},
							MovementType:    appconstant.InternalStockMovementType,
							IsAddition:      false,
						}

						if needed >= *otherStock {
							otherPharmacyMutation.Delta = *otherStock
							currentPharmacyMutation.Delta = *otherStock
							currentStock += currentPharmacyMutation.Delta
							updatedOtherStock := *otherStock - otherPharmacyMutation.Delta

							err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{Id: pp.Id, Stock: &updatedOtherStock})
							if err != nil {
								return nil, err
							}

							err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{Id: *ci.PharmacyProductId, Stock: &currentStock})
							if err != nil {
								return nil, err
							}

							err = smr.CreateOneStockMovement(ctx, otherPharmacyMutation)
							if err != nil {
								return nil, err
							}

							err = smr.CreateOneStockMovement(ctx, currentPharmacyMutation)
							if err != nil {
								return nil, err
							}

							needed -= *otherStock
							index++
							continue
						}

						otherPharmacyMutation.Delta = needed
						currentPharmacyMutation.Delta = needed
						currentStock += currentPharmacyMutation.Delta
						updatedOtherStock := *otherStock - otherPharmacyMutation.Delta

						err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{Id: pp.Id, Stock: &updatedOtherStock})
						if err != nil {
							return nil, err
						}

						err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{Id: *ci.PharmacyProductId, Stock: &currentStock})
						if err != nil {
							return nil, err
						}

						err = smr.CreateOneStockMovement(ctx, otherPharmacyMutation)
						if err != nil {
							return nil, err
						}

						err = smr.CreateOneStockMovement(ctx, currentPharmacyMutation)
						if err != nil {
							return nil, err
						}

						needed -= needed
						index++
					}
				}

				currentStock -= *ci.Quantity
				currentPharmacyMutation.Delta = *ci.Quantity
				currentPharmacyMutation.MovementType = appconstant.SaleStockMovementType
				currentPharmacyMutation.IsAddition = false

				err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{Id: *ci.PharmacyProductId, Stock: &currentStock})
				if err != nil {
					return nil, err
				}

				err = smr.CreateOneStockMovement(ctx, currentPharmacyMutation)
				if err != nil {
					return nil, err
				}

				ci.OrderId = pc.Id
				ci.Pharmacy.Id = pc.Pharmacy.Id
				inactivate := appconstant.InactvateCartBool
				ci.IsActive = &inactivate
				ci.UserId = userId
				err = cr.UpdateOneCartItem(ctx, ci)
				if err != nil {
					return nil, err
				}
			}
		}

		return payment.Id, nil
	})
	if err != nil {
		return nil, err
	}

	paymentId, ok := res.(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	return &paymentId, nil
}
