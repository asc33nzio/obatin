package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type PharmacyProductRepository interface {
	FindPharmaciesWithin25kmByProductId(ctx context.Context, userId int64, productId int64) ([]*entity.Pharmacy, error)
	FindTotalStockPerPartner(ctx context.Context, pp *entity.PharmacyProduct) (*int, error)
	FindStockAndLockById(ctx context.Context, pharmacyProductId int64) (*int, error)
	FindNearbyPartner(ctx context.Context, pp *entity.PharmacyProduct) ([]*entity.PharmacyProduct, error)
	UpdateStockPharmacyProduct(ctx context.Context, pp *entity.PharmacyProduct) error
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
