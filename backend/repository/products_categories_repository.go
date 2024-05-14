package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type ProductCategoriesRepository interface {
	GetAllProductCategoriesByProductId(ctx context.Context, productId int64) (*[]entity.ProductCategory, error)
	CreateProductCategories(ctx context.Context, productId int64, categoryId []int64) error
	DeleteCategoriesByCategoryId(ctx context.Context, categories []int64, productId int64) error
}

type productCategoriesRepositoryPostgres struct {
	db Querier
}

func NewProductCategoriesRepositoryPostgres(db *sql.DB) *productCategoriesRepositoryPostgres {
	return &productCategoriesRepositoryPostgres{
		db: db,
	}
}

func (r *productCategoriesRepositoryPostgres) GetAllProductCategoriesByProductId(ctx context.Context, productId int64) (*[]entity.ProductCategory, error) {
	res := []entity.ProductCategory{}
	queryGetAll := `
		SELECT 
			id, 
			product_id, 
			category_id
		FROM
		    products_categories
		WHERE
			product_id = $1
		AND 
			deleted_at IS NULL
	`
	rows, err := r.db.QueryContext(ctx, queryGetAll, productId)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		category := entity.ProductCategory{}
		err := rows.Scan(&category.Id, &category.ProductId, &category.CategoryId)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		res = append(res, category)
	}
	return &res, nil
}

func (r *productCategoriesRepositoryPostgres) CreateProductCategories(ctx context.Context, productId int64, categories []int64) error {
	var data []interface{}
	var bulkQuery strings.Builder

	queryAdd := `
		INSERT INTO 
			products_categories (product_id, category_id)
		VALUES 
	`
	bulkQuery.WriteString(queryAdd)
	dataCount := appconstant.StartingParamsCount

	for key, category := range categories {
		bulkQuery.WriteString(fmt.Sprintf(`( $%v, $%v )`, dataCount, dataCount+1))
		dataCount += 2
		if key != len(categories)-1 {
			bulkQuery.WriteString(", ")
		}
		data = append(data, productId, category)
	}

	res, err := r.db.ExecContext(ctx, bulkQuery.String(), data...)

	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.ErrInvalidReq(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *productCategoriesRepositoryPostgres) DeleteCategoriesByCategoryId(ctx context.Context, categories []int64, productId int64) error {
	var queryDelete strings.Builder
	var data []interface{}
	queryDelete.WriteString(`
		UPDATE 
			products_categories`)
	queryDelete.WriteString(`
		SET 
			deleted_at = NOW(), updated_at = NOW()
		WHERE
			category_id IN (
		`)
	for key := range categories {
		queryDelete.WriteString(fmt.Sprintf(` $%d`, key))
		data = append(data, categories[key])
		if key != len(categories)-1 {
			queryDelete.WriteString(`, `)
		}
	}
	queryDelete.WriteString(fmt.Sprintf(`
		) AND 
		product_id = $%d
	`, len(categories)))
	data = append(data, productId)
	res, err := r.db.ExecContext(ctx, queryDelete.String(), data...)

	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.ErrInvalidReq(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}
