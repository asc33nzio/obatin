package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
)

type PharmacyProductUsecase interface {
	GetPharmaciesWithin25kmByProductId(ctx context.Context, productId int64) ([]*entity.Pharmacy, error)
	TotalStockPerPartner(ctx context.Context, pp *entity.PharmacyProduct) (*int, error)
	GetPharmacyProductByPartner(ctx context.Context, filter entity.PharmacyProductFilter) (*entity.PharmacyProductListPage, error)
	UpdatePharmacyProduct(ctx context.Context, params entity.UpdatePharmacyProduct) error
	CreatePharmacyProduct(ctx context.Context, body entity.PharmacyProduct) error
}

type pharmacyProductUsecaseImpl struct {
	repoStore repository.RepoStore
	config    *config.Config
}

func NewPharmacyProductUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
) *pharmacyProductUsecaseImpl {
	return &pharmacyProductUsecaseImpl{
		repoStore: repoStore,
		config:    config,
	}
}

func (u *pharmacyProductUsecaseImpl) GetPharmaciesWithin25kmByProductId(ctx context.Context, productId int64) ([]*entity.Pharmacy, error) {
	ur := u.repoStore.UserRepository()
	ppr := u.repoStore.PharmacyProductRepository()

	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	userId, err := ur.FindUserIdByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	hasActiveAddress, err := ur.HasActiveAddress(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	if !hasActiveAddress {
		return nil, apperror.ErrAddressNotFound(apperror.ErrStlNotFound)
	}

	nearbyPharmacies, err := ppr.FindPharmaciesWithin25kmByProductId(ctx, *userId, productId)
	if err != nil {
		return nil, err
	}

	return nearbyPharmacies, nil
}

func (u *pharmacyProductUsecaseImpl) TotalStockPerPartner(ctx context.Context, pp *entity.PharmacyProduct) (*int, error) {
	ppr := u.repoStore.PharmacyProductRepository()

	totalStock, err := ppr.FindTotalStockPerPartner(ctx, pp)
	if err != nil {
		return nil, err
	}

	return totalStock, nil
}

func (u *pharmacyProductUsecaseImpl) GetPharmacyProductByPartner(ctx context.Context, filter entity.PharmacyProductFilter) (*entity.PharmacyProductListPage, error) {
	ppr := u.repoStore.PharmacyProductRepository()
	pnr := u.repoStore.PartnerRepository()

	if filter.Limit < appconstant.DefaultMinLimit {
		filter.Limit = appconstant.DefaultProductLimit
	}
	if filter.Page < appconstant.DefaultMinPage {
		filter.Page = appconstant.DefaultMinPage
	}

	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	partnerId, err := pnr.FindPartnerIdByAuthId(ctx, authenticationId)
	if err != nil {
		return nil, err
	}

	res, err := ppr.GetPharmacyProductListByPartnerId(ctx, filter, *partnerId)
	if err != nil {
		return nil, err
	}

	res.Pagination = entity.PaginationResponse{
		Page:         filter.Page,
		PageCount:    int64(res.TotalRows) / int64(filter.Limit),
		Limit:        filter.Limit,
		TotalRecords: int64(res.TotalRows),
	}
	if res.Pagination.TotalRecords-(res.Pagination.PageCount*int64(filter.Limit)) > 0 {
		res.Pagination.PageCount = int64(res.Pagination.PageCount) + appconstant.DefaultMinPage
	}

	return res, nil
}

func (u *pharmacyProductUsecaseImpl) UpdatePharmacyProduct(ctx context.Context, params entity.UpdatePharmacyProduct) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ppr := rs.PharmacyProductRepository()
		sm := rs.StockMovementRepository()
		pr := rs.ProductRepository()

		if params.UpdateType == appconstant.UpdatePharmacyProductTypeStockMutation {
			ppSource, err := ppr.FindPharmacyProductByPharmacyProductId(ctx, *params.SourcePharmacyProductId)
			if err != nil {
				return nil, err
			}
			if *params.Delta > *ppSource.Stock {
				return nil, apperror.ErrInvalidReq(apperror.ErrStlBadRequest)
			}
			sourceStock, err := ppr.FindStockAndLockById(ctx, *params.SourcePharmacyProductId)
			if err != nil {
				return nil, err
			}
			if sourceStock == nil {
				return nil, apperror.ErrInsufficientStock(nil, ppSource.Product.Name)
			}
			err = sm.CreateOneStockMovement(ctx, &entity.StockMovement{
				PharmacyProduct: entity.PharmacyProduct{
					Id: *params.SourcePharmacyProductId,
				},
				Delta:        *params.Delta,
				IsAddition:   false,
				MovementType: appconstant.InternalStockMovementType,
			})
			if err != nil {
				return nil, err
			}
			sourceStockInt := *sourceStock
			sourceStockInt -= *params.Delta
			err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{
				Stock: &sourceStockInt,
				Id:    *params.SourcePharmacyProductId,
			})
			if err != nil {
				return nil, err
			}

			targetStock, err := ppr.FindStockAndLockById(ctx, *params.TargetPharmacyProductId)
			if err != nil {
				return nil, err
			}

			err = sm.CreateOneStockMovement(ctx, &entity.StockMovement{
				PharmacyProduct: entity.PharmacyProduct{
					Id: *params.TargetPharmacyProductId,
				},
				Delta:        *params.Delta,
				IsAddition:   true,
				MovementType: appconstant.InternalStockMovementType,
			})
			if err != nil {
				return nil, err
			}
			targetStockInt := *targetStock
			targetStockInt += *params.Delta
			err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{
				Stock: &targetStockInt,
				Id:    *params.TargetPharmacyProductId,
			})
			if err != nil {
				return nil, err
			}
		}
		if params.UpdateType == appconstant.UpdatePharmacyProductTypeDetail {
			ppTarget, err := ppr.FindPharmacyProductByPharmacyProductId(ctx, *params.TargetPharmacyProductId)
			if err != nil {
				return nil, err
			}

			if params.Price != nil {
				prdct, err := pr.FindProductDetailById(ctx, ppTarget.Product.Id)
				if err != nil {
					return nil, err
				}
				if *params.Price > prdct.MaxPrice {
					err = pr.UpdateOneById(ctx, entity.UpdateProduct{
						MaxPrice: params.Price,
					}, ppTarget.Product.Id)
					if err != nil {
						return nil, err
					}
				}
				if *params.Price < prdct.MinPrice {
					err = pr.UpdateOneById(ctx, entity.UpdateProduct{
						MinPrice: params.Price,
					}, ppTarget.Product.Id)
					if err != nil {
						return nil, err
					}
				}
			}
			err = ppr.UpdatePharmacyProductDetail(ctx, params)
			if err != nil {
				return nil, err
			}
		}
		if params.UpdateType == appconstant.UpdatePharmacyProductTypeManualMutation {
			targetStock, err := ppr.FindStockAndLockById(ctx, *params.TargetPharmacyProductId)
			if err != nil {
				return nil, err
			}
			err = sm.CreateOneStockMovement(ctx, &entity.StockMovement{
				PharmacyProduct: entity.PharmacyProduct{
					Id: *params.TargetPharmacyProductId,
				},
				Delta:        *params.Delta,
				IsAddition:   *params.IsAddition,
				MovementType: appconstant.ManualAditionStockMovementType,
			})
			if err != nil {
				return nil, err
			}
			targetStockInt := *targetStock
			if *params.IsAddition {
				targetStockInt += *params.Delta
			}
			if !*params.IsAddition {
				targetStockInt -= *params.Delta
				if targetStockInt < 0 {
					return nil, apperror.ErrInvalidReq(apperror.ErrStlBadRequest)
				}
			}

			err = ppr.UpdateStockPharmacyProduct(ctx, &entity.PharmacyProduct{
				Stock: &targetStockInt,
				Id:    *params.TargetPharmacyProductId,
			})
			if err != nil {
				return nil, err
			}
		}

		return nil, nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (u *pharmacyProductUsecaseImpl) CreatePharmacyProduct(ctx context.Context, body entity.PharmacyProduct) error {
	role, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleManager || role == "" {
		return apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
	}
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}
	phPr := u.repoStore.PharmacyProductRepository()
	pnr := u.repoStore.PartnerRepository()

	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	partnerId, err := pnr.FindPartnerIdByAuthId(ctx, authenticationId)
	if err != nil {
		return err
	}

	pharma, err := phPr.FindIdPharmacyProductByProductAndPharmacyId(ctx, *partnerId, *body.Pharmacy.Id)
	if err != nil {
		return err
	}
	if pharma.Pharmacy.Id == nil {
		return apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
	}

	_, err = u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		pr := rs.ProductRepository()
		ppr := rs.PharmacyProductRepository()
		smr := rs.StockMovementRepository()

		prdct, err := pr.FindProductDetailById(ctx, body.Product.Id)
		if err != nil {
			return nil, err
		}

		existPp, err := ppr.FindPharmacyProductByPharmacyIdAndProductId(ctx, *body.Pharmacy.Id, body.Product.Id)
		if err != nil {
			if err.Error() != apperror.ProductNotFoundMsg {
				return nil, err
			}
		}
		if existPp != nil {
			return nil, apperror.ErrPharmacyProductAlreadyExist(nil, body.Product.Id)
		}

		if prdct.MaxPrice > *body.Price {
			err = pr.UpdateOneById(ctx, entity.UpdateProduct{
				MaxPrice: body.Price,
			}, body.Product.Id)

			if err != nil {
				return nil, err
			}
		}

		if prdct.MinPrice > *body.Price {
			err = pr.UpdateOneById(ctx, entity.UpdateProduct{
				MinPrice: body.Price,
			}, body.Product.Id)

			if err != nil {
				return nil, err
			}
		}

		createdPPId, err := ppr.InsertPharmacyProduct(ctx, &body)
		if err != nil {
			return nil, err
		}

		err = smr.CreateOneStockMovement(ctx, &entity.StockMovement{
			PharmacyProduct: entity.PharmacyProduct{
				Id: *createdPPId,
			},
			Delta:        *body.Stock,
			IsAddition:   true,
			MovementType: appconstant.ManualAditionStockMovementType,
		})
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
