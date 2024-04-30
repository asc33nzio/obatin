package usecase

import (
	"context"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type DoctorSpecializationUsecase interface {
	GetAll(ctx context.Context) ([]entity.DoctorSpecialization, error)
}

type doctorSpecializationUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewDoctorSpecializationUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *doctorSpecializationUsecaseImpl {
	return &doctorSpecializationUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *doctorSpecializationUsecaseImpl) GetAll(ctx context.Context) ([]entity.DoctorSpecialization, error) {
	drr := u.repoStore.DoctorSpecializationRepository()

	specializations, err := drr.GetAll(ctx)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	return specializations, nil
}
