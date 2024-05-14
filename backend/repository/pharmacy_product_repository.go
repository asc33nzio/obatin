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

type PharmacyProductRepository interface {
	FindPharmaciesWithin25kmByProductId(ctx context.Context, userId int64, productId int64) ([]*entity.Pharmacy, error)
	FindTotalStockPerPartner(ctx context.Context, pp *entity.PharmacyProduct) (*int, error)
	FindStockAndLockById(ctx context.Context, pharmacyProductId int64) (*int, error)
	FindNearbyPartner(ctx context.Context, pp *entity.PharmacyProduct) ([]*entity.PharmacyProduct, error)
	UpdateStockPharmacyProduct(ctx context.Context, pp *entity.PharmacyProduct) error
	GetPharmacyProductListByPartnerId(ctx context.Context, params entity.PharmacyProductFilter, partnerId int64) (*entity.PharmacyProductListPage, error)
	FindPharmacyProductByPharmacyProductId(ctx context.Context, pharmacyProductId int64) (*entity.PharmacyProduct, error)
	FindPharmacyProductByPharmacyIdAndProductId(ctx context.Context, pharmacyId int64, productId int64) (*entity.PharmacyProduct, error)
	FindIdPharmacyProductByProductAndPharmacyId(ctx context.Context, partnerId int64, pharmacyId int64) (*entity.PharmacyProduct, error)
	InsertPharmacyProduct(ctx context.Context, pp *entity.PharmacyProduct) (*int64, error)
	UpdatePharmacyProductDetail(ctx context.Context, body entity.UpdatePharmacyProduct) error
}

type pharmacyProductRepositoryPostgres struct {
	db Querier
}

func NewPharmacyProductRepositoryPostgres(db *sql.DB) *pharmacyProductRepositoryPostgres {
	return &pharmacyProductRepositoryPostgres{
		db: db,
	}
}

func (r *pharmacyProductRepositoryPostgres) FindPharmaciesWithin25kmByProductId(ctx context.Context, userId int64, productId int64) ([]*entity.Pharmacy, error) {
	res := []*entity.Pharmacy{}
	query := `
		WITH user_geom AS (
			SELECT a.geom 
			FROM users u 
			JOIN addresses a 
			ON u.active_address_id = a.id
			WHERE u.id = $1
			AND u.deleted_at IS NULL
		)
		SELECT
			ST_distancesphere(ug.geom, p.geom)::smallint as distance,
			p.id as pharmacy_id,
			p.name as pharmacy_name,
			p.address as pharmacy_address,
			p.city_id as pharmacy_city_id,
			p.lat as pharmacy_lat,
			p.lng as pharmacy_lng,
			p.pharmacist_name,
			p.pharmacist_license,
			p.pharmacist_phone,
			p.opening_time,
			(p.opening_time + p.operational_hours) as closing_time,
			p.operational_days,
			p.partner_id
		FROM 
			pharmacies_products pp
		JOIN 
			pharmacies p 
		ON 
			pp.pharmacy_id = p.id
		JOIN 
			user_geom ug 
		ON 
			ST_distancesphere(ug.geom, p.geom) <= 25000
		WHERE 
			pp.product_id = $2 
		AND 
			pp.is_active = true 
		AND 
			pp.deleted_at IS NULL
		ORDER BY 
			ST_distancesphere(ug.geom, p.geom) ASC
		LIMIT 10
	`

	rows, err := r.db.QueryContext(ctx, query, userId, productId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrNoNearbyPharmacyProduct(err, productId)
		}

		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		pharmacy := entity.Pharmacy{}
		err := rows.Scan(
			&pharmacy.Distance,
			&pharmacy.Id,
			&pharmacy.Name,
			&pharmacy.Address,
			&pharmacy.City.Id,
			&pharmacy.Latitude,
			&pharmacy.Longitude,
			&pharmacy.PharmacistName,
			&pharmacy.PharmacistLicense,
			&pharmacy.PharmacistPhone,
			&pharmacy.OpeningTime,
			&pharmacy.ClosingTime,
			&pharmacy.OperationalDays,
			&pharmacy.PartnerId,
		)
		if err != nil {
			return nil, err
		}

		res = append(res, &pharmacy)
	}

	return res, nil
}

func (r *pharmacyProductRepositoryPostgres) FindPharmacyProductByPharmacyProductId(ctx context.Context, pharmacyProductId int64) (*entity.PharmacyProduct, error) {
	res := entity.PharmacyProduct{}
	query := `
		SELECT
			pp.id,
			pp.product_id,
            pp.pharmacy_id,
			pp.price,
            pp.stock,
            pp.is_active,
			p.name
        FROM
			pharmacies_products pp
		JOIN
			products p 
		ON 
			pp.product_id = p.id
		WHERE
			pp.id = $1
		AND
			pp.deleted_at IS NULL
		FOR UPDATE
	`
	err := r.db.QueryRowContext(
		ctx,
		query,
		pharmacyProductId,
	).Scan(
		&res.Id,
		&res.Product.Id,
		&res.Pharmacy.Id,
		&res.Price,
		&res.Stock,
		&res.IsActive,
		&res.Product.Name,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}
	return &res, nil
}

func (r *pharmacyProductRepositoryPostgres) FindPharmacyProductByPharmacyIdAndProductId(ctx context.Context, pharmacyId int64, productId int64) (*entity.PharmacyProduct, error) {
	res := entity.PharmacyProduct{}
	query := `
		SELECT
			pp.id,
			pp.product_id,
            pp.pharmacy_id,
			pp.price,
            pp.stock,
            pp.is_active,
			p.name
        FROM
			pharmacies_products pp
		JOIN
			products p 
		ON 
			pp.product_id = p.id
		WHERE
			pp.pharmacy_id = $1
		AND
		    pp.product_id = $2
		AND
			pp.deleted_at IS NULL
		AND
			pp.is_active = true
		FOR UPDATE
	`
	err := r.db.QueryRowContext(
		ctx,
		query,
		pharmacyId,
		productId,
	).Scan(
		&res.Id,
		&res.Product.Id,
		&res.Pharmacy.Id,
		&res.Price,
		&res.Stock,
		&res.IsActive,
		&res.Product.Name,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}
	return &res, nil
}

func (r *pharmacyProductRepositoryPostgres) FindIdPharmacyProductByProductAndPharmacyId(ctx context.Context, partnerId int64, pharmacyId int64) (*entity.PharmacyProduct, error) {
	var pharmacyResId int64
	query := `
		SELECT 
			id
		FROM
			pharmacies
		WHERE
			partner_id=$1
		AND
			id = $2
	`
	err := r.db.QueryRowContext(
		ctx,
		query,
		partnerId,
		pharmacyId,
	).Scan(
		&pharmacyId,
	)
	if err != nil {
		if pharmacyResId == 0 {
			return nil, apperror.ErrNoPharmacyFromPartner(apperror.ErrStlForbiddenAccess)
		}
		return nil, err
	}
	return &entity.PharmacyProduct{
		Pharmacy: entity.Pharmacy{
			Id: &pharmacyResId,
		},
	}, nil

}

func (r *pharmacyProductRepositoryPostgres) FindTotalStockPerPartner(ctx context.Context, pp *entity.PharmacyProduct) (*int, error) {
	var stock *int
	query := `
		SELECT 
			SUM(pp.stock) AS total_stock 
		FROM 
			pharmacies_products pp 
		JOIN 
			pharmacies p ON pp.pharmacy_id = p.id
		WHERE 
			pp.product_id = $1
		AND
			p.partner_id = $2
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		pp.Product.Id,
		pp.Pharmacy.PartnerId,
	).Scan(
		&stock,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	if stock == nil {
		return nil, apperror.NewProductNotFound(apperror.ErrStlNotFound)
	}

	return stock, nil
}

func (r *pharmacyProductRepositoryPostgres) FindStockAndLockById(ctx context.Context, pharmacyProductId int64) (*int, error) {
	var stock int

	query := `
		SELECT
			stock
		FROM
			pharmacies_products
		WHERE
			id = $1
		AND
			is_active = true
		AND
			deleted_at IS NULL
		FOR UPDATE
`

	err := r.db.QueryRowContext(
		ctx,
		query,
		pharmacyProductId,
	).Scan(
		&stock,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &stock, nil
}

func (r pharmacyProductRepositoryPostgres) FindNearbyPartner(ctx context.Context, pp *entity.PharmacyProduct) ([]*entity.PharmacyProduct, error) {
	res := []*entity.PharmacyProduct{}

	query := `
		WITH current_pharmacy as (
			SELECT 
				p.id as id, 
				p.geom as geom, 
				p.partner_id as partner_id
			FROM 	
				pharmacies p 
			WHERE 
				p.id = $1
			AND 
				deleted_at IS NULL
		)
		SELECT
			ST_distancesphere(cp.geom, p.geom)::INTEGER AS distance,
			p.id as pharmacy_id,
			p.partner_id as partner_id,
			p.name as pharmacy_name,
			pp.id as pharmacy_product_id,
			pp.product_id as product_id,
			pp.stock as pharmacy_product_stock
		FROM 
			pharmacies_products pp 
		JOIN 
			pharmacies p 
		ON 
			pp.pharmacy_id = p.id
		JOIN 
			current_pharmacy cp
		ON 
			cp.partner_id = p.partner_id 
		WHERE 
			p.id != cp.id
		AND 
			p.partner_id = cp.partner_id
		AND 
			pp.product_id = $2
		AND 
			pp.is_active = true 
		AND
			pp.stock > 0
		AND 
			pp.deleted_at IS NULL
		ORDER BY
			ST_distancesphere(cp.geom, p.geom) ASC
	`

	rows, err := r.db.QueryContext(ctx, query, *pp.Pharmacy.Id, pp.Product.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrNoNearbyPharmacyPartner(err)
		}

		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		pharmacyProduct := entity.PharmacyProduct{}
		err := rows.Scan(
			&pharmacyProduct.Pharmacy.Distance,
			&pharmacyProduct.Pharmacy.Id,
			&pharmacyProduct.Pharmacy.PartnerId,
			&pharmacyProduct.Pharmacy.Name,
			&pharmacyProduct.Id,
			&pharmacyProduct.Product.Id,
			&pharmacyProduct.Stock,
		)
		if err != nil {
			return nil, err
		}

		res = append(res, &pharmacyProduct)
	}

	return res, nil
}

func (r *pharmacyProductRepositoryPostgres) GetPharmacyProductListByPartnerId(ctx context.Context, params entity.PharmacyProductFilter, partnerId int64) (*entity.PharmacyProductListPage, error) {
	paramsCount := appconstant.StartingParamsCount
	res := []entity.PharmacyProduct{}
	var sb strings.Builder
	rowsCount := 0
	var queryDataCount strings.Builder
	var data []interface{}

	sb.WriteString(`
		WITH sales_data AS (
			SELECT
				pp2.product_id,
				SUM(CASE WHEN sm.movement_type = 'sale' THEN sm.delta ELSE 0 END) AS total_sales
			FROM
				pharmacies_products pp2
			JOIN
				stock_movements sm ON pp2.id = sm.pharmacy_product_id
			WHERE
				pp2.deleted_at IS NULL
				AND sm.deleted_at IS NULL
				AND sm.is_addition IS FALSE
			GROUP BY
				pp2.product_id
		),
			partner_pharmacies AS (
		SELECT 
			ph.partner_id AS partner_id,
			ph.id AS pharmacy_id,
			ph.name AS pharmacy_name
		FROM 
			pharmacies ph
		WHERE
			ph.partner_id = $1
	`)
	if params.SortBy != nil {
		if *params.SortBy == appconstant.SortByPharmacy {
			sb.WriteString(`ORDER BY pharmacy_name`)
		}
	}
	sb.WriteString(`
			)
		SELECT 	
			pp.id,
			p.id, 
			p.name, 
			p.product_slug, 
			ppc.pharmacy_id,
			ppc.pharmacy_name,
			p.image_url, 
			pp.price, 
			pp.stock,
			pp.is_active,
			COALESCE(sd.total_sales, 0) AS sales 
		FROM 
			products p
		JOIN
			pharmacies_products pp 
		ON
			pp.product_id = p.id 
		JOIN 
			partner_pharmacies ppc
		ON
			pp.pharmacy_id = ppc.pharmacy_id
		JOIN 
			partners pt
		ON
			pt.id = ppc.partner_id
		LEFT JOIN
		    sales_data sd on p.id = sd.product_id
	`)

	queryParams, paramsData := convertGetPharmacyProductQueryParamstoSql(params)
	sb.WriteString(queryParams)
	data = append(data, partnerId)
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
		pp := entity.PharmacyProduct{}
		err := rows.Scan(&pp.Id, &pp.Product.Id, &pp.Product.Name, &pp.Product.Slug, &pp.Pharmacy.Id, &pp.Pharmacy.Name,
			&pp.Product.ImageUrl, &pp.Price, &pp.Stock, &pp.IsActive, &pp.Sales)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		res = append(res, pp)
	}
	return &entity.PharmacyProductListPage{
		Products:  res,
		TotalRows: rowsCount,
	}, nil

}

func (r *pharmacyProductRepositoryPostgres) UpdateStockPharmacyProduct(ctx context.Context, pp *entity.PharmacyProduct) error {
	query := `
		UPDATE
			pharmacies_products
		SET
			stock = $1 , updated_at = NOW()
		WHERE
			id = $2
		AND
			is_active = true
		AND
			deleted_at IS NULL
`

	res, err := r.db.ExecContext(
		ctx,
		query,
		*pp.Stock,
		pp.Id,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *pharmacyProductRepositoryPostgres) InsertPharmacyProduct(ctx context.Context, pp *entity.PharmacyProduct) (*int64, error) {
	var ppId int64
	queryInsertPharmacyProduct := `
        INSERT INTO
            pharmacies_products(
                product_id, pharmacy_id, price, stock, is_active
			)
        VALUES ($1, $2, $3, $4, $5)
		RETURNING id
    `

	err := r.db.QueryRowContext(
		ctx,
		queryInsertPharmacyProduct,
		pp.Product.Id,
		*pp.Pharmacy.Id,
		*pp.Price,
		*pp.Stock,
		pp.IsActive,
	).Scan(&ppId)
	if err != nil {
		return &ppId, apperror.NewInternal(err)
	}

	if ppId == 0 {
		return nil, apperror.NewInternal(err)
	}

	return &ppId, nil
}

func (r *pharmacyProductRepositoryPostgres) UpdatePharmacyProductDetail(ctx context.Context, body entity.UpdatePharmacyProduct) error {
	var query strings.Builder
	var data []interface{}

	query.WriteString(`
		UPDATE 
			pharmacies_products 
		SET
	`)

	queryParams, paramsData := convertUpdatePharmacyProductQueryParamstoSql(body)
	query.WriteString(queryParams)
	data = append(data, paramsData...)
	res, err := r.db.ExecContext(ctx, query.String(), data...)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil

}
