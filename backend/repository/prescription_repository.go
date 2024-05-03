package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type PrescriptionRepository interface {
	CreateOnePrescription(ctx context.Context, cp *entity.CreatePrescription) error
	IsPrescriptionExistByIdAndUserId(ctx context.Context, p entity.Prescription) (bool, error)
}

type prescriptionRepositoryPostgres struct {
	db Querier
}

func NewPrescriptionRepositoryPostgres(db *sql.DB) *prescriptionRepositoryPostgres {
	return &prescriptionRepositoryPostgres{
		db: db,
	}
}

func (r *prescriptionRepositoryPostgres) CreateOnePrescription(ctx context.Context, cp *entity.CreatePrescription) error {
	query := `
		INSERT INTO
			prescriptions(user_id,doctor_id)
		VALUES
			($1,$2)
		RETURNING
			id
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		cp.UserId,
		cp.DoctorId,
	).Scan(
		&cp.Id,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *prescriptionRepositoryPostgres) IsPrescriptionExistByIdAndUserId(ctx context.Context, p entity.Prescription) (bool, error) {
	var isExist bool
	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				prescriptions 
			WHERE 
				id = $1
			AND
				user_id = $2
			AND 
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		p.Id,
		*p.User.Id,
	).Scan(
		&isExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isExist, nil
}
