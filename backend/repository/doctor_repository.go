package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
)

type DoctorRepository interface {
	CreateNewDoctor(ctx context.Context, authentiactionId int64, certificate string) error
}

type doctorRepositoryPostgres struct {
	db Querier
}

func NewDoctorRepositoryPostgres(db *sql.DB) *doctorRepositoryPostgres {
	return &doctorRepositoryPostgres{
		db: db,
	}
}

func (r *doctorRepositoryPostgres) CreateNewDoctor(ctx context.Context, authentiactionId int64, certificate string) error {
	q := `
		INSERT INTO
			doctors(authentication_id, certificate)
		VALUES ($1, $2)
	`

	res, err := r.db.ExecContext(
		ctx,
		q,
		authentiactionId,
		certificate,
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
