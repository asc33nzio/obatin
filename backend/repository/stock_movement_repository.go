package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type StockMovementRepository interface {
	CreateOneStockMovement(ctx context.Context, sm *entity.StockMovement) error
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
