package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/apperror"
	"obatin/constant"
	"obatin/entity"
	"strings"
)

type ProductRepository interface {
	GetProductsList(ctx context.Context, params entity.ProductFilter) (*entity.ProductListPage, error)
}

type productRepositoryPostgres struct {
	db Querier
}

func NewProductRepositoryPostgres(db *sql.DB) *productRepositoryPostgres {
	return &productRepositoryPostgres{
		db: db,
	}
}

func (r *productRepositoryPostgres) GetProductsList(ctx context.Context, params entity.ProductFilter) (*entity.ProductListPage, error) {
	paramsCount := constant.StartingParamsCount
	res := []entity.ProductList{}
	var sb strings.Builder
	rowsCount := 0
	var queryDataCount strings.Builder
	var data []interface{}

	sb.WriteString(`
		SELECT DISTINCT 
			p.id, p.name, p.product_slug, p.selling_unit, p.min_price, p.max_price, p.image_url 
		FROM 
			products p 
		JOIN 
			products_categories pc 
		ON
			p.id = pc.product_id 
	`)
	queryParams, paramsData := convertProductQueryParamstoSql(params)
	sb.WriteString(queryParams)
	data = append(data, paramsData...)
	queryDataCount.WriteString(fmt.Sprintf(` SELECT COUNT (*) FROM ( %v )`, sb.String()))
	err := r.db.QueryRowContext(ctx, queryDataCount.String(), data...).Scan(&rowsCount)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	if len(data) > 0 {
		paramsCount = len(data) + 1
	}
	paginationParams, paginationData := convertPaginationParamsToSql(params, paramsCount)
	sb.WriteString(paginationParams)
	data = append(data, paginationData...)
	rows, err := r.db.QueryContext(ctx, sb.String(), data...)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		product := entity.ProductList{}
		err := rows.Scan(&product.Id, &product.Name, &product.Slug, &product.SellingUnit,
			&product.MinPrice, &product.MaxPrice, &product.ImageUrl)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		res = append(res, product)
	}
	return &entity.ProductListPage{
		Products:  res,
		TotalRows: rowsCount,
	}, nil
}
