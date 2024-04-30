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

type CategoryUsecase interface {
	GetAllCategory(ctx context.Context) ([]entity.CategoryNested, error)
	CreateOneCategory(ctx context.Context, body entity.CategoryRequest) (*entity.Category, error)
	UpdateOneCategory(ctx context.Context, body entity.CategoryUpdateRequest, slug string) (*entity.Category, error)
	DeleteOneCategoryBySlug(ctx context.Context, slug string) error
}

type categoryUsecaseImpl struct {
	repoStore        repository.RepoStore
	config           *config.Config
	cloudinaryUpload util.CloudinaryItf
}

func NewCategoryUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
	cloudinaryUpload util.CloudinaryItf,
) *categoryUsecaseImpl {
	return &categoryUsecaseImpl{
		repoStore:        repoStore,
		config:           config,
		cloudinaryUpload: cloudinaryUpload,
	}
}

func (u *categoryUsecaseImpl) GetAllCategory(ctx context.Context) ([]entity.CategoryNested, error) {
	cr := u.repoStore.CategoryRepository()
	res := []entity.CategoryNested{}

	category2 := []entity.CategoryNested{}
	category3 := []entity.CategoryNested{}
	categories, err := cr.GetAllCategory(ctx)
	if err != nil {
		return nil, err
	}
	for _, c := range categories {
		if c.Level == appconstant.CategoryLevel1Int {
			res = insertFromCategoryRepo(res, c)
		}
		if c.Level == appconstant.CategoryLevel2Int {
			category2 = insertFromCategoryRepo(category2, c)
		}
		if c.Level == appconstant.CategoryLevel3Int {
			category3 = insertFromCategoryRepo(category3, c)
		}
	}

	for _, c := range category3 {
		for key, c2 := range category2 {
			if *c.ParentId == c2.Id {
				category2[key].Children = insertToCategorySlice(category2[key].Children, c)
			}
		}
	}
	for _, c := range category2 {
		for key, c2 := range res {
			if *c.ParentId == c2.Id {
				res[key].Children = insertToCategorySlice(res[key].Children, c)
			}
		}
	}

	return res, nil
}

func (u *categoryUsecaseImpl) CreateOneCategory(ctx context.Context, body entity.CategoryRequest) (*entity.Category, error) {
	cr := u.repoStore.CategoryRepository()
	if body.Level > appconstant.MaxLevelWithChild && body.HasChild {
		return nil, apperror.ErrInvalidReq(nil)
	}

	categorySlug, err := cr.FindOneCategoryBySlug(ctx, body.Slug)
	if categorySlug != nil {
		return nil, apperror.ErrInvalidSlug(nil)
	}
	if err != nil {
		return nil, err
	}

	imageUploadedUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, body.ImageUrl)
	if err != nil {
		return nil, err
	}

	category, err := cr.CreateOneCategory(ctx, entity.CategoryBody{
		Name:     body.Name,
		Slug:     body.Slug,
		ImageUrl: imageUploadedUrl,
		ParentId: body.ParentId,
		HasChild: body.HasChild,
		Level:    body.Level,
	})
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (u *categoryUsecaseImpl) UpdateOneCategory(ctx context.Context, body entity.CategoryUpdateRequest, slug string) (*entity.Category, error) {
	cr := u.repoStore.CategoryRepository()
	if body.Level != nil && body.HasChild != nil {
		if *body.Level > appconstant.MaxLevelWithChild && *body.HasChild {
			return nil, apperror.ErrInvalidReq(nil)
		}
	}

	if body.Slug != nil {
		categorySlug, err := cr.FindOneCategoryBySlug(ctx, *body.Slug)
		if categorySlug != nil {
			return nil, apperror.ErrInvalidSlug(nil)
		}
		if err != nil {
			return nil, err
		}
	}

	var imageUploadedUrl *string
	if body.ImageUrl != nil {
		imageUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, *body.ImageUrl)
		if err != nil {
			return nil, err
		}
		imageUploadedUrl = &imageUrl
	}

	category, err := cr.UpdateOneCategory(ctx, entity.CategoryUpdateBody{
		Name:     body.Name,
		Slug:     body.Slug,
		ImageUrl: imageUploadedUrl,
		ParentId: body.ParentId,
		HasChild: body.HasChild,
		Level:    body.Level,
	}, slug)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (u *categoryUsecaseImpl) DeleteOneCategoryBySlug(ctx context.Context, slug string) error {
	cr := u.repoStore.CategoryRepository()

	category, err := cr.FindOneCategoryBySlug(ctx, slug)
	if err != nil {
		return err
	}
	if category == nil {
		return apperror.ErrCategoryNotFound(nil)
	}
	_, err = u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		cRs := rs.CategoryRepository()
		
		err = cRs.DeleteOneCategoryById(ctx, category.Id)
		if err != nil {
			return nil, err
		}
		err = cRs.DeleteProductCategoryByCategoryId(ctx, category.Id)
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

func insertToCategorySlice(Target []entity.CategoryNested, Input entity.CategoryNested) []entity.CategoryNested {
	return append(Target, entity.CategoryNested{
		Id:       Input.Id,
		Name:     Input.Name,
		Slug:     Input.Slug,
		ImageUrl: Input.ImageUrl,
		ParentId: Input.ParentId,
		HasChild: Input.HasChild,
		Level:    Input.Level,
		Children: Input.Children,
	})
}

func insertFromCategoryRepo(Target []entity.CategoryNested, Input entity.Category) []entity.CategoryNested {
	return append(Target, entity.CategoryNested{
		Id:       Input.Id,
		Name:     Input.Name,
		Slug:     Input.Slug,
		ImageUrl: Input.ImageUrl,
		ParentId: Input.ParentId,
		HasChild: Input.HasChild,
		Level:    Input.Level,
	})
}
