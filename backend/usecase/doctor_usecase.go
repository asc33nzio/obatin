package usecase

import (
	"context"
	"database/sql"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
	"obatin/util"
)

type DoctorUsecase interface {
	GetOneByAuthId(ctx context.Context, id int64) (*entity.Doctor, error)
	GetDoctorList(ctx context.Context, params entity.DoctorFilter) (*entity.DoctorListPage, error)
	UpdateOneDoctor(ctx context.Context, body entity.DoctorUpdateRequest, id int64) (*entity.DoctorDetail, error)
}

type doctorUsecaseImpl struct {
	repoStore        repository.RepoStore
	config           *config.Config
	cloudinaryUpload util.CloudinaryItf
}

func NewDoctorUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
	cloudinaryUpload util.CloudinaryItf,
) *doctorUsecaseImpl {
	return &doctorUsecaseImpl{
		repoStore:        repoStore,
		config:           config,
		cloudinaryUpload: cloudinaryUpload,
	}
}

func (u *doctorUsecaseImpl) GetOneByAuthId(ctx context.Context, id int64) (*entity.Doctor, error) {
	dRep := u.repoStore.DoctorRepository()

	doctor, err := dRep.FindDoctorByAuthId(ctx, id)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	return doctor, nil
}

func (u *doctorUsecaseImpl) GetDoctorList(ctx context.Context, params entity.DoctorFilter) (*entity.DoctorListPage, error) {
	dRep := u.repoStore.DoctorRepository()
	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	res, err := dRep.GetDoctorList(ctx, params)
	if err != nil {
		return nil, err
	}

	res.Pagination = entity.PaginationResponse{
		Page:         params.Page,
		PageCount:    int64(res.TotalRows) / int64(params.Limit),
		Limit:        params.Limit,
		TotalRecords: int64(res.TotalRows),
	}
	if res.Pagination.TotalRecords-(res.Pagination.PageCount*int64(params.Limit)) > 0 {
		res.Pagination.PageCount = int64(res.Pagination.PageCount) + appconstant.DefaultMinPage
	}

	return res, nil
}

func (u *doctorUsecaseImpl) UpdateOneDoctor(ctx context.Context, body entity.DoctorUpdateRequest, id int64) (*entity.DoctorDetail, error) {
	dr := u.repoStore.DoctorRepository()

	doctor, err := dr.FindDoctorDetailByAuthIdRedacted(ctx, id)
	if doctor == nil {
		return nil, apperror.ErrDoctorNotFound(nil)
	}
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrDoctorNotFound(nil)
		}
		return nil, apperror.NewInternal(err)
	}

	var imageUploadedUrl *string
	if *body.AvatarFile != nil {
		imageUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, *body.AvatarFile)
		if err != nil {
			return nil, err
		}
		imageUploadedUrl = &imageUrl
	}

	updatedDoc, err := dr.UpdateOneDoctor(ctx, entity.DoctorUpdateRequest{
		Name:             body.Name,
		AvatarUrl:        imageUploadedUrl,
		IsOnline:         body.IsOnline,
		Experiences:      body.Experiences,
		Fee:              body.Fee,
		Opening:          body.Opening,
		OperationalHours: body.OperationalHours,
		OperationalDays:  body.OperationalDays,
	}, id)
	if err != nil {
		return nil, err
	}

	return updatedDoc, nil
}
