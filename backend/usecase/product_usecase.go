package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
	"obatin/util"
)

type ProductUsecase interface {
	GetAllProducts(ctx context.Context, params entity.ProductFilter) (*entity.ProductListPage, error)
	GetProductDetailBySlug(ctx context.Context, slug string) (*entity.ProductDetail, error)
	UpdateProductDetaiBySlug(ctx context.Context, body entity.UpdateProduct, slug string) error
	CreateProduct(ctx context.Context, product entity.AddProduct) error
}

type productUsecaseImpl struct {
	repoStore        repository.RepoStore
	config           *config.Config
	cloudinaryUpload util.CloudinaryItf
}

func NewProductUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
	cloudinaryUpload util.CloudinaryItf,
) *productUsecaseImpl {
	return &productUsecaseImpl{
		repoStore:        repoStore,
		config:           config,
		cloudinaryUpload: cloudinaryUpload,
	}
}

func (u *productUsecaseImpl) GetAllProducts(ctx context.Context, params entity.ProductFilter) (*entity.ProductListPage, error) {
	pr := u.repoStore.ProductRepository()
	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	res, err := pr.GetProductsList(ctx, params)
	if err != nil {
		return nil, err
	}
	role, _ := ctx.Value(appconstant.AuthenticationRole).(string)
	if role != appconstant.RoleAdmin {
		for _, v := range res.Products {
			v.Sales = 0
		}
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

func (u *productUsecaseImpl) GetProductDetailBySlug(ctx context.Context, slug string) (*entity.ProductDetail, error) {
	pr := u.repoStore.ProductRepository()
	cr := u.repoStore.CategoryRepository()
	var forSales bool

	role, _ := ctx.Value(appconstant.AuthenticationRole).(string)
	if role == appconstant.RoleAdmin {
		forSales = true
	}

	product, err := pr.FindProductDetailBySlug(ctx, slug, forSales)
	if err != nil {
		return nil, err
	}
	categoryList, err := cr.GetAllCategoryByProductId(ctx, product.Id)
	if err != nil {
		return nil, err
	}
	product.Categories = append(product.Categories, categoryList...)

	return product, nil
}

func (u *productUsecaseImpl) UpdateProductDetaiBySlug(ctx context.Context, body entity.UpdateProduct, slug string) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {

		pr := rs.ProductRepository()
		cr := rs.CategoryRepository()
		pcr := rs.ProductCategoriesRepository()

		product, err := pr.FindProductDetailBySlug(ctx, slug, false)
		if err != nil {
			return nil, err
		}
		if product == nil {
			return nil, apperror.NewProductNotFound(apperror.ErrStlNotFound)
		}
		if body.Slug != nil {
			productSlug, err := pr.FindProductDetailBySlug(ctx, *body.Slug, false)
			if err != nil {
				if err.Error() != apperror.ProductNotFoundMsg {
					return nil, err
				}
			}
			if productSlug != nil {
				return nil, apperror.ErrDuplicateSlug(apperror.ErrStlBadRequest)
			}
		}

		if body.Categories != nil {
			categoryIdList := []int64{}
			newCategoryIdList := []int64{}

			categoryList, err := cr.GetAllCategoryByProductId(ctx, product.Id)
			if err != nil {
				return nil, err
			}
			for _, v := range *body.Categories {
				category, err := cr.FindOneCategoryById(ctx, v)
				if err != nil {
					return nil, err
				}
				if category == nil {
					return nil, apperror.ErrCategoryNotFound(apperror.ErrStlNotFound)
				}
			}

			for _, category := range categoryList {
				categoryIdList = append(categoryIdList, category.Id)
			}

			newCategoryIdList = append(newCategoryIdList, *body.Categories...)

			categoryRemoved, categoryAdded := findChanges(categoryIdList, newCategoryIdList)
			if len(categoryRemoved) != 0 {
				err := pcr.DeleteCategoriesByCategoryId(ctx, categoryRemoved, product.Id)
				if err != nil {
					return nil, err
				}
			}
			if len(categoryAdded) != 0 {
				err := pcr.CreateProductCategories(ctx, product.Id, categoryAdded)
				if err != nil {
					return nil, err
				}
			}
		}
		if body.Image != nil {
			imageUploadedUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, *body.Image)
			if err != nil {
				return nil, err
			}
			body.ImageUrl = &imageUploadedUrl
			body.ThumbnailUrl = &imageUploadedUrl
		}
		err = pr.UpdateOneById(ctx, body, product.Id)
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

func (u *productUsecaseImpl) CreateProduct(ctx context.Context, body entity.AddProduct) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		pr := rs.ProductRepository()
		cr := rs.CategoryRepository()
		pcr := rs.ProductCategoriesRepository()

		for key := range body.Categories {
			category, err := cr.FindOneCategoryById(ctx, body.Categories[key])
			if err != nil {
				return nil, err
			}
			if category == nil {
				return nil, apperror.ErrCategoryNotFound(apperror.ErrStlNotFound)
			}
		}
		prdct, err := pr.FindProductDetailBySlug(ctx, body.Product.Slug, false)
		if err != nil {
			if err.Error() != apperror.ProductNotFoundMsg {
				return nil, err
			}
		}
		if prdct != nil {
			return nil, apperror.ErrDuplicateSlug(nil)
		}

		if body.Image != nil {
			imageUploadedUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, *body.Image)
			if err != nil {
				return nil, err
			}

			body.Product.ImageUrl = imageUploadedUrl
			body.Product.ThumbnailUrl = imageUploadedUrl
		}

		prdctId, err := pr.CreateOne(ctx, body.Product)
		if err != nil {
			return nil, err
		}
		if prdctId == nil {
			return nil, apperror.NewInternal(apperror.ErrStlInternal)
		}

		err = pcr.CreateProductCategories(ctx, *prdctId, body.Categories)
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

func findChanges(old []int64, new []int64) ([]int64, []int64) {

	aMap := make(map[int64]bool)
	bMap := make(map[int64]bool)

	for _, val := range old {
		aMap[val] = true
	}

	added := []int64{}
	for _, val := range new {
		bMap[val] = true
		if !aMap[val] {
			added = append(added, val)
		}
	}

	removed := []int64{}
	for _, val := range old {
		if !bMap[val] {
			removed = append(removed, val)
		}
	}
	return added, removed
}
