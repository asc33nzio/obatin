package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type PrescriptionItemRepository interface {
	IsPrescriptionItemExist(ctx context.Context, p entity.PrescriptionItem) (bool, error)
	FindAmount(ctx context.Context, p entity.PrescriptionItem) (*int, error)
	CreatePrescriptionItems(ctx context.Context, cp *entity.CreatePrescription) error
}

type prescriptionItemRepositoryPostgres struct {
	db Querier
}

func NewPrescriptionItemRepositoryPostgres(db *sql.DB) *prescriptionItemRepositoryPostgres {
	return &prescriptionItemRepositoryPostgres{
		db: db,
	}
}

func (r *prescriptionItemRepositoryPostgres) IsPrescriptionItemExist(ctx context.Context, p entity.PrescriptionItem) (bool, error) {
	var isExist bool
	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				prescription_items 
			WHERE 
				prescription_id = $1
			AND
				product_id = $2
			AND 
				deleted_at IS NULL
		)
	`
	err := r.db.QueryRowContext(
		ctx,
		query,
		p.Prescription.Id,
		p.Product.Id,
	).Scan(
		&isExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isExist, nil
}

func (r *prescriptionItemRepositoryPostgres) FindAmount(ctx context.Context, p entity.PrescriptionItem) (*int, error) {
	var amount *int
	query := `
		SELECT 
			amount	
		FROM 
			prescription_items 
		WHERE 
			prescription_id = $1
		AND
			product_id = $2
		AND 
			deleted_at IS NULL
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		p.Prescription.Id,
		p.Product.Id,
	).Scan(
		&amount,
	)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return amount, nil
}

func (r *prescriptionItemRepositoryPostgres) CreatePrescriptionItems(ctx context.Context, cp *entity.CreatePrescription) error {
	query, args := prescriptionItemsBulkInsertQuery(cp)

	res, err := r.db.ExecContext(
		ctx,
		query,
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
		return apperror.NewInternal(apperror.ErrStlBadRequest)
	}

	return nil
}
