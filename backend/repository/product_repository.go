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
	FindProductDetailBySlug(ctx context.Context, slug string) (*entity.ProductDetail, error)
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

func (r *productRepositoryPostgres) FindProductDetailBySlug(ctx context.Context, slug string) (*entity.ProductDetail, error) {
	res := entity.ProductDetail{}

	q := `
		SELECT 
			p.id,     
			p.name,
			p.min_price,
            p.max_price,
			p.product_slug,   
			p.generic_name,
			p.general_indication,  
			p.dosage,  
			p.how_to_use,  
			p.side_effects,  
			p.contraindication,  
			p.warning,  
			p.bpom_number,
			p.content,  
			p.description,  
			p.classification,  
			p.packaging,  
			p.selling_unit,
			p.weight,  
			p.height,  
			p.length,  
			p.width,  
			p.image_url,  
			p.thumbnail_url,  
			p.is_active,
			p.is_prescription_required,
			m.id,
			m.name  
		FROM 
			products p 
		JOIN
			manufacturers m
		ON 
			p.manufacturer_id = m.id
		WHERE
			p.product_slug = $1
		AND
		    p.deletedAt IS NULL
		AND 
			p.is_active IS TRUE

	`
	err := r.db.QueryRowContext(ctx, q, slug).Scan(
		&res.Id,
		&res.Name,
		&res.MinPrice,
		&res.MaxPrice,
		&res.Slug,
		&res.GenericName,
		&res.GeneralIndication,
		&res.Dosage,
		&res.HowToUse,
		&res.SideEffects,
		&res.Contraindication,
		&res.Warning,
		&res.BpomNumber,
		&res.Content,
		&res.Description,
		&res.Classification,
		&res.Packaging,
		&res.SellingUnit,
		&res.Weight,
		&res.Height,
		&res.Length,
		&res.Width,
		&res.ImageUrl,
		&res.ThumbnailUrl,
		&res.IsActive,
		&res.IsPrescriptionRequired,
		&res.Manufacturer.ID,
		&res.Manufacturer.Name,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &res, nil
}
