package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type OrderUsecase interface {
	GetUserOrders(ctx context.Context, authId int64, params *entity.OrdersFilter) (*entity.OrdersPagination, error)
	GetAllOrders(ctx context.Context, params *entity.OrdersFilter) (*entity.OrdersPagination, error)
	UpdateOrderStatus(ctx context.Context, o *entity.Order) error
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

func (u *orderUsecaseImpl) GetUserOrders(ctx context.Context, authId int64, params *entity.OrdersFilter) (*entity.OrdersPagination, error) {
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

	params.UserId = userId
	orders, err := or.FindAllOrders(ctx, params)
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

func (u *orderUsecaseImpl) GetAllOrders(ctx context.Context, params *entity.OrdersFilter) (*entity.OrdersPagination, error) {
	or := u.repoStore.OrderRepository()
	pr := u.repoStore.PartnerRepository()

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	if role == appconstant.RoleManager {
		partnerId, err := pr.FindPartnerIdByAuthId(ctx, authenticationId)
		if err != nil {
			return nil, err
		}

		params.PartnerId = partnerId
	}

	orders, err := or.FindAllOrders(ctx, params)
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

func (u *orderUsecaseImpl) UpdateOrderStatus(ctx context.Context, o *entity.Order) error {
	or := u.repoStore.OrderRepository()
	ur := u.repoStore.UserRepository()

	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	if role == appconstant.RoleUser {
		authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
		if !ok {
			return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
		}

		userId, err := ur.FindUserIdByAuthId(ctx, authenticationId)
		if err != nil {
			return err
		}

		o.User.Id = userId
	}

	err := or.UpdateOrderById(ctx, o)
	if err != nil {
		return err
	}

	return nil
}
