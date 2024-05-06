package usecase

import (
	"context"
	"obatin/apperror"
	"obatin/config"
	"obatin/constant"
	"obatin/entity"
	"obatin/repository"
)

type PrescriptionUsecase interface {
	CreatePrescription(ctx context.Context, cp *entity.CreatePrescription) error
}

type prescriptionUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewPrescriptionUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *prescriptionUsecaseImpl {
	return &prescriptionUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *prescriptionUsecaseImpl) CreatePrescription(ctx context.Context, cp *entity.CreatePrescription) error {
	dr := u.repoStore.DoctorRepository()

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	doctor, err := dr.FindDoctorByAuthId(ctx, authenticationId)
	if err != nil {
		return err
	}

	cp.DoctorId = doctor.Id

	_, err = u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		pr := rs.PrescriptionRepository()
		pir := rs.PrescriptionItemRepository()

		err := pr.CreateOnePrescription(ctx, cp)
		if err != nil {
			return nil, err
		}

		err = pir.CreatePrescriptionItems(ctx, cp)
		if err != nil {
			return nil, err
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}
