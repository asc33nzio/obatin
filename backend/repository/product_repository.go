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

type ProductRepository interface {
	GetProductsList(ctx context.Context, params entity.ProductFilter) (*entity.ProductListPage, error)
	FindProductDetailBySlug(ctx context.Context, slug string, forSales bool) (*entity.ProductDetail, error)
	FindProductDetailById(ctx context.Context, productId int64) (*entity.ProductDetail, error)
	CreateOne(ctx context.Context, product entity.ProductDetail) (*int64, error)
	IsProductExistById(ctx context.Context, productId int64) (bool, error)
	IsPrescriptionRequired(ctx context.Context, productId int64) (bool, error)
	UpdateOneById(ctx context.Context, body entity.UpdateProduct, productId int64) error
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
	paramsCount := appconstant.StartingParamsCount
	res := []entity.ProductList{}
	var sb strings.Builder
	rowsCount := 0
	var queryDataCount strings.Builder
	var data []interface{}

	selectQuery := `
	WITH sales_data AS (
		SELECT
			pp.product_id,
			SUM(CASE WHEN sm.movement_type = 'sale' THEN sm.delta ELSE 0 END) AS total_sales
		FROM
			pharmacies_products pp
		JOIN
			stock_movements sm ON pp.id = sm.pharmacy_product_id
		WHERE
			pp.deleted_at IS NULL
			AND sm.deleted_at IS NULL
			AND sm.is_addition IS FALSE
		GROUP BY
			pp.product_id
	)
		SELECT DISTINCT 
			p.id, 
			p.name, 
			p.product_slug, 
			p.selling_unit, 
			p.min_price, 
			p.max_price, 
			p.image_url, 
			p.is_prescription_required,
			COALESCE(sd.total_sales, 0) AS sales `
	joinQuery := `
		FROM 
			products p 
		JOIN
			products_categories pc ON p.id = pc.product_id
		LEFT JOIN
			sales_data sd ON p.id = sd.product_id`

	queryParams, paramsData := convertProductQueryParamstoSql(params)
	sb.WriteString(selectQuery)
	if params.Search != "" {
		searchParamsCount := appconstant.StartingParamsCount
		if params.Category != "" {
			searchParamsCount += 1
		}
		sb.WriteString(fmt.Sprintf(`
		, CASE
			WHEN 
				p.name ILIKE '%%' ||$%v|| '%%'  THEN 1
			WHEN 
				p.generic_name ILIKE '%%' ||$%v|| '%%'  THEN 2
			WHEN 
				p.content ILIKE '%%' ||$%v|| '%%'  THEN 3
			ELSE 4
			END AS search_priority`, searchParamsCount, searchParamsCount, searchParamsCount))
	}
	sb.WriteString(joinQuery)
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
	paginationParams, paginationData := convertPaginationParamsToSql(params.Limit, params.Page, paramsCount)
	sb.WriteString(paginationParams)
	data = append(data, paginationData...)
	rows, err := r.db.QueryContext(ctx, sb.String(), data...)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		product := entity.ProductList{}
		if params.Search == "" {
			err := rows.Scan(
				&product.Id,
				&product.Name,
				&product.Slug,
				&product.SellingUnit,
				&product.MinPrice,
				&product.MaxPrice,
				&product.ImageUrl,
				&product.IsPrescriptionRequired,
				&product.Sales,
			)
			if err != nil {
				return nil, apperror.NewInternal(err)
			}
			res = append(res, product)
		}
		if params.Search != "" {
			err := rows.Scan(
				&product.Id,
				&product.Name,
				&product.Slug,
				&product.SellingUnit,
				&product.MinPrice,
				&product.MaxPrice,
				&product.ImageUrl,
				&product.IsPrescriptionRequired,
				&product.Sales,
				&product.SearchPriority,
			)
			if err != nil {
				return nil, apperror.NewInternal(err)
			}
			res = append(res, product)
		}

	}
	return &entity.ProductListPage{
		Products:  res,
		TotalRows: rowsCount,
	}, nil
}

func (r *productRepositoryPostgres) FindProductDetailBySlug(ctx context.Context, slug string, forSales bool) (*entity.ProductDetail, error) {
	res := entity.ProductDetail{}
	var fullQuery strings.Builder
	queryColumns := `
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
	`
	fullQuery.WriteString(convertQuerySalesFromProductDetail(forSales, queryColumns))

	var data []interface{}
	data = append(data,
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
	if forSales {
		data = append(data,
			&res.Sales.January,
			&res.Sales.February,
			&res.Sales.March,
			&res.Sales.April,
			&res.Sales.May,
			&res.Sales.June,
			&res.Sales.July,
			&res.Sales.August,
			&res.Sales.September,
			&res.Sales.October,
			&res.Sales.November,
			&res.Sales.December,
		)
	}

	err := r.db.QueryRowContext(ctx, fullQuery.String(), slug).Scan(data...)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}
		return nil, apperror.NewInternal(err)
	}

	return &res, nil
}

func (r *productRepositoryPostgres) FindProductDetailById(ctx context.Context, productId int64) (*entity.ProductDetail, error) {
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
			p.id = $1
		AND
		    p.deleted_at IS NULL
		AND 
			p.is_active IS TRUE

	`
	err := r.db.QueryRowContext(ctx, q, productId).Scan(
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

func (r *productRepositoryPostgres) CreateOne(ctx context.Context, product entity.ProductDetail) (*int64, error) {
	var productId int64
	queryInsert := `
		INSERT INTO 
			products (
				manufacturer_id,      
				name,
				min_price,
            	max_price,
				product_slug,   
				generic_name,
				general_indication,  
				dosage,  
				how_to_use,  
				side_effects,  
				contraindication,  
				warning,  
				bpom_number,
				content,  
				description,  
				classification,  
				packaging,  
				selling_unit,
				weight,  
				height,  
				length,  
				width,  
				image_url,  
				thumbnail_url,  
				is_active,
				is_prescription_required 
			)
		VALUES
				($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
				$11, $12, $13, $14, $15, $16, $17, $18, 
				$19, $20, $21, $22, $23, $24, $25, $26)
		RETURNING 
				id
	`
	err := r.db.QueryRowContext(ctx, queryInsert,
		product.Manufacturer.ID,
		product.Name,
		product.MinPrice,
		product.MaxPrice,
		product.Slug,
		product.GenericName,
		product.GeneralIndication,
		product.Dosage,
		product.HowToUse,
		product.SideEffects,
		product.Contraindication,
		product.Warning,
		product.BpomNumber,
		product.Content,
		product.Description,
		product.Classification,
		product.Packaging,
		product.SellingUnit,
		product.Weight,
		product.Height,
		product.Length,
		product.Width,
		product.ImageUrl,
		product.ThumbnailUrl,
		product.IsActive,
		product.IsPrescriptionRequired,
	).Scan(&productId)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &productId, nil
}

func (r *productRepositoryPostgres) IsProductExistById(ctx context.Context, productId int64) (bool, error) {
	var isExist bool
	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				products 
			WHERE 
				id = $1
			AND
				is_active = true
			AND 
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		productId,
	).Scan(
		&isExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isExist, nil
}

func (r *productRepositoryPostgres) IsPrescriptionRequired(ctx context.Context, productId int64) (bool, error) {
	var isExist bool
	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				products 
			WHERE 
				id = $1
			AND
				is_active = true
			AND
				is_prescription_required = true
			AND 
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		productId,
	).Scan(
		&isExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isExist, nil
}

func (r *productRepositoryPostgres) UpdateOneById(ctx context.Context, body entity.UpdateProduct, productId int64) error {
	var query strings.Builder
	var data []interface{}

	query.WriteString(`
		UPDATE
			products
		SET `)

	queryParams, paramsData := convertUpdateProductQueryParamstoSql(body, productId)
	query.WriteString(queryParams)
	data = append(data, paramsData...)

	_, err := r.db.ExecContext(ctx, query.String(), data...)
	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}
