package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type OrderRepository interface {
	CreateOneOrder(ctx context.Context, o *entity.Order) (*entity.Order, error)
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
