package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type ShippingRepository interface {
	FindShippingMethodsByPharmacyId(ctx context.Context, pharmacyId int64) ([]*entity.Shipping, error)
}

type shippingRepositoryPostgres struct {
	db Querier
}

func NewShippingRepositoryPostgres(db *sql.DB) *shippingRepositoryPostgres {
	return &shippingRepositoryPostgres{
		db: db,
	}
}

func (r *shippingRepositoryPostgres) FindShippingMethodsByPharmacyId(ctx context.Context, pharmacyId int64) ([]*entity.Shipping, error) {
	res := []*entity.Shipping{}

	query := `
		WITH pharmacy_detail AS (
			SELECT 
				p.id as pharmacy_id,
				p.city_id as city_id
			FROM
				pharmacies p
			WHERE
				p.id = $1
		)
		SELECT
			s.id,
			s.pharmacy_id,
			pd.city_id,
			sm.id,
			sm.price,
			sm.code,
			sm.description,
			sm.name,
			sm.estimated,
			sm.type,
			sm.service
		FROM
			shippings s
		JOIN
			shipping_methods sm
		ON
			s.shipping_method_id = sm.id
		AND
			sm.deleted_at IS NULL
		JOIN
			pharmacy_detail pd
		ON
			s.pharmacy_id = pd.pharmacy_id
		WHERE
			s.pharmacy_id = $1
		AND
			s.deleted_at IS NULL
	`

	rows, err := r.db.QueryContext(
		ctx,
		query,
		pharmacyId,
	)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		shipping := &entity.Shipping{}

		err = rows.Scan(
			&shipping.Id,
			&shipping.Pharmacy.Id,
			&shipping.Pharmacy.City.Id,
			&shipping.ShippingMethod.Id,
			&shipping.ShippingMethod.Price,
			&shipping.ShippingMethod.Code,
			&shipping.ShippingMethod.Description,
			&shipping.ShippingMethod.Name,
			&shipping.ShippingMethod.Estimated,
			&shipping.ShippingMethod.Type,
			&shipping.ShippingMethod.Service,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		res = append(res, shipping)
	}

	return res, nil
}
