package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type ManufacturerUsecase interface {
	GetAllManufacturer(ctx context.Context, params entity.ManufacturerFilter) (*entity.ManufacturerListPage, error)
}

type manufacturerUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewManufacturerUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *manufacturerUsecaseImpl {
	return &manufacturerUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *manufacturerUsecaseImpl) GetAllManufacturer(ctx context.Context, params entity.ManufacturerFilter) (*entity.ManufacturerListPage, error) {
	mr := u.repoStore.ManufacturerRepository()
	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	res, err := mr.GetAllManufacturer(ctx, params)
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
