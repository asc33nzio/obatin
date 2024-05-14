package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type PrescriptionUsecase interface {
	CreatePrescription(ctx context.Context, cp *entity.CreatePrescription) (*int64, error)
	GetAllUserPrescriptions(ctx context.Context, authId int64) ([]*entity.Prescription, error)
	GetAllDoctorPrescriptions(ctx context.Context, authId int64) ([]*entity.Prescription, error)
	GetPrescriptionDetails(ctx context.Context, prescriptionId int64) ([]*entity.PrescriptionItem, error)
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

func (u *prescriptionUsecaseImpl) CreatePrescription(ctx context.Context, cp *entity.CreatePrescription) (*int64, error) {
	dr := u.repoStore.DoctorRepository()

	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	doctor, err := dr.FindDoctorByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	cp.DoctorId = doctor.Id

	res, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
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

		return cp.Id, nil
	})
	if err != nil {
		return nil, err
	}

	id, ok := res.(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	return &id, nil
}

func (u *prescriptionUsecaseImpl) GetAllUserPrescriptions(ctx context.Context, authId int64) ([]*entity.Prescription, error) {
	pr := u.repoStore.PrescriptionRepository()
	ur := u.repoStore.UserRepository()

	userid, err := ur.FindUserIdByAuthId(ctx, authId)
	if err != nil {
		return nil, err
	}

	prescriptions, err := pr.FindAllUserPrescriptions(ctx, *userid)
	if err != nil {
		return nil, err
	}

	return prescriptions, nil
}

func (u *prescriptionUsecaseImpl) GetAllDoctorPrescriptions(ctx context.Context, authId int64) ([]*entity.Prescription, error) {
	dr := u.repoStore.DoctorRepository()
	pr := u.repoStore.PrescriptionRepository()

	doctor, err := dr.FindDoctorByAuthId(ctx, authId)
	if err != nil {
		return nil, err
	}

	prescriptions, err := pr.FindAllDoctorPrescriptions(ctx, doctor.Id)
	if err != nil {
		return nil, err
	}

	return prescriptions, nil
}

func (u *prescriptionUsecaseImpl) GetPrescriptionDetails(ctx context.Context, prescriptionId int64) ([]*entity.PrescriptionItem, error) {
	pir := u.repoStore.PrescriptionItemRepository()

	items, err := pir.FindAllPrescriptionItems(ctx, prescriptionId)
	if err != nil {
		return nil, err
	}

	return items, nil
}
