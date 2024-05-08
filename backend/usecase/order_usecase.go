package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type OrderUsecase interface {
	GetUserOrders(ctx context.Context, authId int64, params *entity.UserOrdersFilter) (*entity.UserOrdersPagination, error)
}

type orderUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewOrderUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *orderUsecaseImpl {
	return &orderUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *orderUsecaseImpl) GetUserOrders(ctx context.Context, authId int64, params *entity.UserOrdersFilter) (*entity.UserOrdersPagination, error) {
	ur := u.repoStore.UserRepository()
	or := u.repoStore.OrderRepository()

	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	userId, err := ur.FindUserIdByAuthId(ctx, authId)
	if err != nil {
		return nil, err
	}

	orders, err := or.FindUserOrders(ctx, *userId, params)
	if err != nil {
		return nil, err
	}

	orders.Pagination = entity.PaginationResponse{
		Page:         params.Page,
		PageCount:    orders.TotalRows / int64(params.Limit),
		Limit:        params.Limit,
		TotalRecords: orders.TotalRows,
	}
	if orders.Pagination.TotalRecords-(orders.Pagination.PageCount*int64(params.Limit)) > 0 {
		orders.Pagination.PageCount = int64(orders.Pagination.PageCount) + appconstant.DefaultMinPage
	}

	return orders, nil
}
