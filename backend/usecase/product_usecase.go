package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type ProductUsecase interface {
	GetAllProducts(ctx context.Context, params entity.ProductFilter) (*entity.ProductListPage, error)
	GetProductDetailBySlug(ctx context.Context, slug string) (*entity.ProductDetail, error)
}

type productUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewProductUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *productUsecaseImpl {
	return &productUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *productUsecaseImpl) GetAllProducts(ctx context.Context, params entity.ProductFilter) (*entity.ProductListPage, error) {
	pr := u.repoStore.ProductRepository()
	if params.Limit < 1 {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < 1 {
		params.Page = 1
	}

	res, err := pr.GetProductsList(ctx, params)
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
		res.Pagination.PageCount = int64(res.Pagination.PageCount) + 1
	}

	return res, nil
}

func (u *productUsecaseImpl) GetProductDetailBySlug(ctx context.Context, slug string) (*entity.ProductDetail, error) {
	repo := u.repoStore.ProductRepository()

	product, err := repo.FindProductDetailBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	return product, nil
}
