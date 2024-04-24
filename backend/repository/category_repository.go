package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type CategoryRepository interface {
	GetAllCategory(ctx context.Context) ([]entity.Category, error)
	CreateOneCategory(ctx context.Context, body entity.CategoryBody) (*entity.Category, error)
	UpdateOneCategory(ctx context.Context, body entity.CategoryUpdateBody, slug string) (*entity.Category, error)
	FindOneCategoryBySlug(ctx context.Context, slug string) (*entity.Category, error)
	DeleteOneCategoryById(ctx context.Context, id int64) error
	DeleteProductCategoryByCategoryId(ctx context.Context, id int64) error
}

type categoryRepositoryPostgres struct {
	db Querier
}

func NewCategoryRepositoryPostgres(db *sql.DB) *categoryRepositoryPostgres {
	return &categoryRepositoryPostgres{
		db: db,
	}
}

func (r *categoryRepositoryPostgres) GetAllCategory(ctx context.Context) ([]entity.Category, error) {
	res := []entity.Category{}

	q := `
		SELECT 
			id, name, category_slug, image_url, parent_id, has_child_categories, category_level 
		FROM
			categories
		ORDER BY
			id
			`

	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	defer rows.Close()

	for rows.Next() {
		category := entity.Category{}
		err := rows.Scan(&category.Id, &category.Name, &category.Slug, &category.ImageUrl, &category.ParentId, &category.HasChild, &category.Level)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		res = append(res, category)
	}

	err = rows.Err()
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	return res, nil

}

func (r *categoryRepositoryPostgres) CreateOneCategory(ctx context.Context, body entity.CategoryBody) (*entity.Category, error) {
	category := entity.Category{}
	q := `
        INSERT INTO
            categories(
                name, category_slug, image_url, parent_id, has_child_categories, category_level)
        VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING
            id, name, category_slug, image_url, parent_id, has_child_categories, category_level 
        `

	err := r.db.QueryRowContext(ctx, q, body.Name, body.Slug, body.ImageUrl, body.ParentId, body.HasChild, body.Level).
		Scan(&category.Id, &category.Name, &category.Slug, &category.ImageUrl, &category.ParentId, &category.HasChild, &category.Level)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &category, nil

}

func (r *categoryRepositoryPostgres) UpdateOneCategory(ctx context.Context, body entity.CategoryUpdateBody, slug string) (*entity.Category, error) {
	category := entity.Category{}
	var query strings.Builder
	var data []interface{}

	query.WriteString(`
		UPDATE
			categories
		SET `)

	queryParams, paramsData := convertUpdateCategoryQueryParamstoSql(body, slug)
	query.WriteString(queryParams)
	data = append(data, paramsData...)

	err := r.db.QueryRowContext(ctx, query.String(), data...).
		Scan(&category.Id, &category.Name, &category.Slug, &category.ImageUrl, &category.ParentId, &category.HasChild, &category.Level)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &category, nil
}

func (r *categoryRepositoryPostgres) FindOneCategoryBySlug(ctx context.Context, slug string) (*entity.Category, error) {
	category := entity.Category{}
	q := `
		SELECT
			id, name, category_slug, image_url, parent_id, has_child_categories, category_level 
		FROM
			categories
		WHERE
			category_slug = $1
			`
	err := r.db.QueryRowContext(ctx, q, slug).
		Scan(&category.Id, &category.Name, &category.Slug, &category.ImageUrl, &category.ParentId, &category.HasChild, &category.Level)
	if err != nil && err != sql.ErrNoRows {
		return nil, apperror.NewInternal(err)
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &category, nil
}

func (r *categoryRepositoryPostgres) DeleteOneCategoryById(ctx context.Context, id int64) error {
	q := `
        UPDATE
            categories
		SET
		    deletedAt = NOW(), updatedAt = NOW()
        WHERE
            id = $1
		OR
			parent_id = $1	
		AND 
			deletedat IS NULL
            `
	res, err := r.db.ExecContext(ctx, q, id)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *categoryRepositoryPostgres) DeleteProductCategoryByCategoryId(ctx context.Context, id int64) error {
	q := `
	UPDATE
		products_categories
	SET
		deletedAt = NOW(), updatedAt = NOW()
	WHERE
		category_id = $1	
	AND 
		deletedat IS NULL
		`
	res, err := r.db.ExecContext(ctx, q, id)
	if err != nil {
		return apperror.NewInternal(err)
	}

	_, err = res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}
