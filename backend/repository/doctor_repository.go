package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
)

type DoctorRepository interface {
	CreateNewDoctor(ctx context.Context, authentiactionId int64, certificate string, doctorSpecializationId int) error
}

type doctorRepositoryPostgres struct {
	db Querier
}

func NewDoctorRepositoryPostgres(db *sql.DB) *doctorRepositoryPostgres {
	return &doctorRepositoryPostgres{
		db: db,
	}
}

func (r *doctorRepositoryPostgres) CreateNewDoctor(ctx context.Context, authentiactionId int64, certificate string, doctorSpecializationId int) error {
	queryCreateNewDoctor := `
		INSERT INTO
			doctors(
				authentication_id, 
				certificate_url, 
				doctor_specialization_id)
		VALUES ($1, $2, $3)
	`

	res, err := r.db.ExecContext(
		ctx,
		queryCreateNewDoctor,
		authentiactionId,
		certificate,
		doctorSpecializationId,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.NewInternal(err)
	}

	return nil
}
