package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type OrderRepository interface {
	CreateOneOrder(ctx context.Context, o *entity.Order) (*entity.Order, error)
	GetAllUserOrders(ctx context.Context, userId int64) (*entity.Order, error)
}

type orderRepositoryPostgres struct {
	db Querier
}

func NewOrderRepositoryPostgres(db *sql.DB) *orderRepositoryPostgres {
	return &orderRepositoryPostgres{
		db: db,
	}
}

func (r *orderRepositoryPostgres) CreateOneOrder(ctx context.Context, o *entity.Order) (*entity.Order, error) {
	query := `
		INSERT INTO
			orders(
				user_id,
				shipping_id,
				pharmacy_id,
				number_items,
				shipping_cost,
				subtotal,
				payment_id
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7)
		RETURNING
			id
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		*o.User.Id,
		o.Shipping.Id,
		*o.Pharmacy.Id,
		o.NumberItems,
		o.ShippingCost,
		o.Subtotal,
		o.Payment.Id,
	).Scan(&o.Id)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return o, nil
}

func (r *orderRepositoryPostgres) GetAllUserOrders(ctx context.Context, userId int64) (*entity.Order, error) {
	query := `
		SELECT
			o.id,
			o.user_id,
			o.shipping_id,
			o.pharmacy_id,
			o.status,
			o.number_items,
			o.shipping_cost,
			o.subtotal,
			o.payment_id,
			o.created_at,
			sm.code,
			sm.name,
			sm.type,
			p.name as pharmacy_name,
			p.address as pharmacy_address,
			p.city_id as pharmacy_city_id,
			p.lat as pharmacy_lat,
			p.lng as pharmacy_lng,
			p.pharmacist_name,
			p.pharmacist_license,
			p.pharmacist_phone,
			p.opening_time,
			p.closing_time,
			p.operational_days,
			p.partner_id,
			pd.name,
			pd.thumbnail_url,
			pd.selling_unit,
			pd.is_prescription_required,
			ci.id,
			ci.prescription_id,
			ci.quantity
		FROM
			orders o
		JOIN
			shippings s
		ON
			o.shipping_id = s.id
		JOIN
			shipping_methods sm
		ON
			s.shipping_method_id = sm.id
		JOIN
			pharmacies p
		ON
			o.pharmacy_id = p.id
		JOIN
			cart_items ci
		ON
			ci.order_id = o.id
		AND
			ci.is_active = false
		JOIN
			products pd
		ON
			ci.product_id = pd.id
		WHERE
			o.user_id = $1
		AND
			o.deleted_at IS NULL
	`

	rows, err := r.db.QueryContext(
		ctx,
		query,
		userId,
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		err = rows.Scan()
		if err != nil {
			return nil, err
		}
	}

	return nil, nil
}
