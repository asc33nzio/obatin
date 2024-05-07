package usecase

import (
	"context"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type ShippingUsecase interface {
	AvailableShippingsPerPharmacy(ctx context.Context, pharmacyId int64) ([]*entity.Shipping, error)
}

type shippingUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewShippingUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *shippingUsecaseImpl {
	return &shippingUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *shippingUsecaseImpl) AvailableShippingsPerPharmacy(ctx context.Context, pharmacyId int64) ([]*entity.Shipping, error) {
	sr := u.repoStore.ShippingRepository()

	shippings, err := sr.FindShippingMethodsByPharmacyId(ctx, pharmacyId)
	if err != nil {
		return nil, err
	}

	return shippings, nil
}
