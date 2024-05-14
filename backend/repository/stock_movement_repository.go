package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type StockMovementRepository interface {
	CreateOneStockMovement(ctx context.Context, sm *entity.StockMovement) error
	FindAllStockMovements(ctx context.Context, stm *entity.StockMovementFilter) (*entity.StockMovementPagination, error)
}

type stockMovementRepositoryPostgres struct {
	db Querier
}

func NewStockMovementRepositoryPostgres(db *sql.DB) *stockMovementRepositoryPostgres {
	return &stockMovementRepositoryPostgres{
		db: db,
	}
}

func (r *stockMovementRepositoryPostgres) CreateOneStockMovement(ctx context.Context, sm *entity.StockMovement) error {
	query := `
		INSERT INTO
			stock_movements(
				pharmacy_product_id,
				delta,
				is_addition,
				movement_type
			)
		VALUES
			($1, $2, $3, $4)
	`

	res, err := r.db.ExecContext(
		ctx,
		query,
		sm.PharmacyProduct.Id,
		sm.Delta,
		sm.IsAddition,
		sm.MovementType,
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

func (r *stockMovementRepositoryPostgres) FindAllStockMovements(ctx context.Context, stm *entity.StockMovementFilter) (*entity.StockMovementPagination, error) {
	res := entity.StockMovementPagination{}
	var query strings.Builder
	var queryWhere strings.Builder
	var queryOrderPart strings.Builder
	var queryRowCount strings.Builder
	var totalRow int
	var args []interface{}
	args = append(args, *stm.PartnerId)

	query.WriteString(`
	SELECT
		sm.id,
		sm.pharmacy_product_id,
		sm.delta,
		sm.is_addition,
		sm.movement_type,
		sm.created_at,
		p.id,
		p.name,
		ph.id,
		ph.name
	FROM
		stock_movements sm
	JOIN
		pharmacies_products pp
	ON
		sm.pharmacy_product_id = pp.id
	JOIN
		products p
	ON
		pp.product_id = p.id
	AND
		p.deleted_at IS NULL
	JOIN
		pharmacies ph
	ON
		pp.pharmacy_id = ph.id
`)

	queryWhere.WriteString(`
		WHERE
			sm.deleted_at IS NULL
		AND
			ph.partner_id = $1
	`,
	)

	queryOrderPart.WriteString(
		`ORDER BY
			sm.created_at DESC
		`,
	)

	if stm.PharmacyId != nil {
		queryWhere.WriteString(fmt.Sprintf(` AND ph.id = $%d `, len(args)+1))
		args = append(args, *stm.PharmacyId)
	}

	if stm.ProductId != nil {
		queryWhere.WriteString(fmt.Sprintf(` AND p.id = $%d `, len(args)+1))
		args = append(args, *stm.ProductId)
	}

	query.WriteString(queryWhere.String())
	query.WriteString(queryOrderPart.String())

	queryRowCount.WriteString(fmt.Sprintf(` SELECT COUNT (*) FROM ( %v ) `, query.String()))
	err := r.db.QueryRowContext(ctx, queryRowCount.String(), args...).Scan(&totalRow)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	query.WriteString(fmt.Sprintf(" LIMIT $%d OFFSET $%d ", len(args)+1, len(args)+2))
	args = append(args, stm.Limit)
	args = append(args, stm.Page-1)
	rows, err := r.db.QueryContext(
		ctx,
		query.String(),
		args...,
	)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		sm := entity.StockMovement{}
		err = rows.Scan(
			&sm.Id,
			&sm.PharmacyProduct.Id,
			&sm.Delta,
			&sm.IsAddition,
			&sm.MovementType,
			&sm.CreatedAt,
			&sm.PharmacyProduct.Product.Id,
			&sm.PharmacyProduct.Product.Name,
			&sm.PharmacyProduct.Pharmacy.Id,
			&sm.PharmacyProduct.Pharmacy.Name,
		)
		if err != nil {
			return nil, err
		}
		res.StockMovements = append(res.StockMovements, &sm)
	}

	res.TotalRows = totalRow
	return &res, nil
}
