package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type StockMovementUsecase interface {
	GetAllStockMovements(ctx context.Context, params *entity.StockMovementFilter) (*entity.StockMovementPagination, error)
}

type stockMovementUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewStockMovementUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *stockMovementUsecaseImpl {
	return &stockMovementUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *stockMovementUsecaseImpl) GetAllStockMovements(ctx context.Context, params *entity.StockMovementFilter) (*entity.StockMovementPagination, error) {
	sr := u.repoStore.StockMovementRepository()
	pnr := u.repoStore.PartnerRepository()

	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	partnerId, err := pnr.FindPartnerIdByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}
	params.PartnerId = partnerId

	res, err := sr.FindAllStockMovements(ctx, params)
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
