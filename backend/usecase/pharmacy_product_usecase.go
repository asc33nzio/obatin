package usecase

import (
	"context"
	"obatin/apperror"
	"obatin/config"
	"obatin/constant"
	"obatin/entity"
	"obatin/repository"
)

type PharmacyProductUsecase interface {
	GetPharmaciesWithin25kmByProductId(ctx context.Context, productId int64) ([]*entity.Pharmacy, error)
	TotalStockPerPartner(ctx context.Context, pp *entity.PharmacyProduct) (*int, error)
}

type pharmacyProductUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewPharmacyProductUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *pharmacyProductUsecaseImpl {
	return &pharmacyProductUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *pharmacyProductUsecaseImpl) GetPharmaciesWithin25kmByProductId(ctx context.Context, productId int64) ([]*entity.Pharmacy, error) {
	ur := u.repoStore.UserRepository()
	ppr := u.repoStore.PharmacyProductRepository()

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

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

	nearbyPharmacies, err := ppr.FindPharmaciesWithin25kmByProductId(ctx, *userId, productId)
	if err != nil {
		return nil, err
	}

	return nearbyPharmacies, nil
}

func (u *pharmacyProductUsecaseImpl) TotalStockPerPartner(ctx context.Context, pp *entity.PharmacyProduct) (*int, error) {
	ppr := u.repoStore.PharmacyProductRepository()

	totalStock, err := ppr.FindTotalStockPerPartner(ctx, pp)
	if err != nil {
		return nil, err
	}

	return totalStock, nil
}
