package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type OrderRepository interface {
	CreateOneOrder(ctx context.Context, o *entity.Order) (*entity.Order, error)
	UpdateOrderById(ctx context.Context, o *entity.Order) error
	FindOrdersByPaymentId(ctx context.Context, paymentId int64) ([]*entity.Order, error)
	FindAllOrders(ctx context.Context, params *entity.OrdersFilter) (*entity.OrdersPagination, error)
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

func (r *orderRepositoryPostgres) UpdateOrderById(ctx context.Context, o *entity.Order) error {
	var query strings.Builder
	var querySetPart strings.Builder
	var queryWherePart strings.Builder
	var args []interface{}
	args = append(args, *o.Id)

	if o.WantDelete {
		querySetPart.WriteString(" , deleted_at = NOW() ")
	}

	if o.Status != "" {
		querySetPart.WriteString(fmt.Sprintf(" , status = $%d ", len(args)+1))
		args = append(args, o.Status)
	}

	query.WriteString(`
		UPDATE
			orders
		SET
			updated_at = NOW()
	`)

	queryWherePart.WriteString(`
		WHERE
			id = $1
		AND
			deleted_at IS NULL
	`)

	if o.User.Id != nil {
		queryWherePart.WriteString(fmt.Sprintf(" AND user_id = $%d ", len(args)+1))
		args = append(args, *o.User.Id)
	}

	query.WriteString(querySetPart.String())
	query.WriteString(queryWherePart.String())
	res, err := r.db.ExecContext(
		ctx,
		query.String(),
		args...,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.ErrOrderNotFound(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *orderRepositoryPostgres) FindOrdersByPaymentId(ctx context.Context, paymentId int64) ([]*entity.Order, error) {
	res := []*entity.Order{}

	query := `
		SELECT
			o.id,
			o.status
		FROM 
			orders o
		WHERE
			o.payment_id = $1
		AND
			o.deleted_at IS NULL
	`

	rows, err := r.db.QueryContext(ctx, query, paymentId)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		o := entity.Order{}
		err := rows.Scan(
			&o.Id,
			&o.Status,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		res = append(res, &o)
	}

	return res, nil
}

func (r *orderRepositoryPostgres) FindAllOrders(ctx context.Context, params *entity.OrdersFilter) (*entity.OrdersPagination, error) {
	res := []*entity.Order{}
	cartItems := []*entity.CartItem{}
	var rowsCount int64

	query, args := allOrdersQuery(params)

	rows, err := r.db.QueryContext(
		ctx,
		query,
		args...,
	)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	var idx int
	for rows.Next() {
		o := entity.Order{}
		ci := entity.CartItem{}

		err = rows.Scan(
			&rowsCount,
			&o.Id,
			&o.User.Id,
			&o.User.Authentication.Id,
			&o.User.Name,
			&o.Shipping.Id,
			&o.Pharmacy.Id,
			&o.Status,
			&o.NumberItems,
			&o.ShippingCost,
			&o.Subtotal,
			&o.Payment.Id,
			&o.Payment.InvoiceNumber,
			&o.Payment.PaymentProofUrl,
			&o.CreatedAt,
			&o.Shipping.ShippingMethod.Code,
			&o.Shipping.ShippingMethod.Name,
			&o.Shipping.ShippingMethod.Type,
			&o.Pharmacy.Name,
			&o.Pharmacy.Address,
			&o.Pharmacy.City.Id,
			&o.Pharmacy.Latitude,
			&o.Pharmacy.Longitude,
			&o.Pharmacy.PharmacistName,
			&o.Pharmacy.PharmacistLicense,
			&o.Pharmacy.PharmacistPhone,
			&o.Pharmacy.OpeningTime,
			&o.Pharmacy.ClosingTime,
			&o.Pharmacy.OperationalDays,
			&o.Pharmacy.PartnerId,
			&ci.Product.Name,
			&ci.Product.ThumbnailUrl,
			&ci.Product.SellingUnit,
			&ci.Product.IsPrescriptionRequired,
			&ci.Product.Weight,
			&ci.Product.Slug,
			&ci.Id,
			&ci.PrescriptionId,
			&ci.Quantity,
			&ci.OrderId,
			&ci.Product.Id,
			&ci.PharmacyProductId,
			&ci.PharmacyProduct.Price,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		cartItems = append(cartItems, &ci)
		if len(res) > 0 {
			if *res[idx].Id == *o.Id {
				continue
			}
			res = append(res, &o)
			idx++
			continue
		}
		res = append(res, &o)
	}

	for _, order := range res {
		for _, cartItem := range cartItems {
			if *order.Id == *cartItem.OrderId {
				order.CartItems = append(order.CartItems, cartItem)
			}
		}
	}

	return &entity.OrdersPagination{
		Orders:    res,
		TotalRows: rowsCount,
	}, nil
}
