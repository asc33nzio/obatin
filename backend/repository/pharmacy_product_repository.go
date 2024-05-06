package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
	"strconv"
	"strings"

	"github.com/lib/pq"
)

type PharmacyProductRepository interface {
	FindPharmaciesProductsWithin25km(ctx context.Context, c *entity.CartItem) ([]*entity.PharmacyProduct, error)
	FindTotalStockPerPartner(ctx context.Context, pp entity.PharmacyProduct) (*int, error)
}

type pharmacyProductRepositoryPostgres struct {
	db Querier
}

func NewPharmacyProductRepositoryPostgres(db *sql.DB) *pharmacyProductRepositoryPostgres {
	return &pharmacyProductRepositoryPostgres{
		db: db,
	}
}

func (r *pharmacyProductRepositoryPostgres) FindPharmaciesProductsWithin25km(ctx context.Context, c *entity.CartItem) ([]*entity.PharmacyProduct, error) {
	res := []*entity.PharmacyProduct{}
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
			pp.id,  
			pp.price, 
			pp.stock, 
			p.id,
			p.name,
			p.address,
			p.lat,
			p.lng,
			p.pharmacist_name,
			p.pharmacist_license,
			p.pharmacist_phone,
			p.city_id,
			p.partner_id,
			total_stock.total_stock,
			shipping_methods.shipping_details
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
		JOIN 
			(
				SELECT 
					p.partner_id,
					SUM(pp.stock) AS total_stock 
				FROM 
					pharmacies_products pp 
				JOIN 
					pharmacies p ON pp.pharmacy_id = p.id
				WHERE 
					pp.product_id = $2 
				GROUP BY 
					p.partner_id
			) AS total_stock ON total_stock.partner_id = p.partner_id
		LEFT JOIN
			(
				SELECT
					p.id AS pharmacy_id,
					ARRAY_AGG(ROW(sm.id, sm.name, sm.price, sm.type)) 
					AS shipping_details
				FROM
					pharmacies p
				JOIN
					shippings s ON s.pharmacy_id = p.id
				JOIN
					shipping_methods sm ON s.shipping_method_id = sm.id
				GROUP BY
					p.id
			) AS shipping_methods ON shipping_methods.pharmacy_id = p.id
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

	rows, err := r.db.QueryContext(ctx, query, c.UserId, c.Product.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrNoNearbyPharmacyProduct(err, c.Product.Id)
		}

		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var shippingDetails pq.StringArray
		pharmacyProduct := entity.PharmacyProduct{}
		err := rows.Scan(
			&pharmacyProduct.Pharmacy.Distance,
			&pharmacyProduct.Id,
			&pharmacyProduct.Price,
			&pharmacyProduct.Stock,
			&pharmacyProduct.Pharmacy.Id,
			&pharmacyProduct.Pharmacy.Name,
			&pharmacyProduct.Pharmacy.Address,
			&pharmacyProduct.Pharmacy.Latitude,
			&pharmacyProduct.Pharmacy.Longitude,
			&pharmacyProduct.Pharmacy.PharmacistName,
			&pharmacyProduct.Pharmacy.PharmacistLicense,
			&pharmacyProduct.Pharmacy.PharmacistPhone,
			&pharmacyProduct.Pharmacy.City.Id,
			&pharmacyProduct.Pharmacy.Id,
			&pharmacyProduct.TotalStock,
			&shippingDetails,
		)
		if err != nil {
			return nil, err
		}

		for _, sd := range shippingDetails {
			sd = strings.TrimPrefix(sd, "(")
			sd = strings.TrimSuffix(sd, ")")
			parts := strings.Split(sd, ",")

			id, _ := strconv.ParseInt(parts[0], 10, 64)
			price, _ := strconv.Atoi(parts[2])

			detail := entity.ShippingMethod{
				Id:    id,
				Name:  strings.Trim(parts[1], "\""),
				Price: price * *pharmacyProduct.Pharmacy.Distance / 1000,
				Type:  parts[3],
			}

			pharmacyProduct.Pharmacy.ShippingMethods = append(pharmacyProduct.Pharmacy.ShippingMethods, &detail)
		}
		pharmacyProduct.Product.Id = c.Product.Id
		res = append(res, &pharmacyProduct)
	}

	return res, nil
}

func (r *pharmacyProductRepositoryPostgres) FindTotalStockPerPartner(ctx context.Context, pp entity.PharmacyProduct) (*int, error) {
	var stock int
	query := `
		SELECT 
			p.partner_id,
			SUM(pp.stock) AS total_stock 
		FROM 
			pharmacies_products pp 
		JOIN 
			pharmacies p ON pp.pharmacy_id = p.id
		WHERE 
			pp.product_id = $1
		AND
			p.partner_id = $2
		GROUP BY 
			p.partner_id
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
		return nil, apperror.NewInternal(err)
	}

	return &stock, nil
}
