package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/constant"
	"obatin/entity"
	"obatin/repository"
)

type PharmacyUsecase interface {
	GetAllPharmacies(ctx context.Context, params entity.PharmacyFilter) (*entity.PharmacyListPage, error)
}

type pharmacyUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewPharmacyUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *pharmacyUsecaseImpl {
	return &pharmacyUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *pharmacyUsecaseImpl) GetAllPharmacies(ctx context.Context, params entity.PharmacyFilter) (*entity.PharmacyListPage, error) {
	pr := u.repoStore.PharmacyRepository()
	pnr := u.repoStore.PartnerRepository()

	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	role, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	if role == constant.RoleManager {
		authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
		if !ok {
			return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
		}

		partnerId, err := pnr.FindPartnerIdByAuthId(ctx, authenticationId)
		if err != nil {
			return nil, err
		}

		params.PartnerId = partnerId
	}

	res, err := pr.FindPharmacyList(ctx, params)
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
