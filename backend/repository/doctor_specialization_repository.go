package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type DoctorSpecializationRepository interface {
	GetAll(ctx context.Context) ([]entity.DoctorSpecialization, error)
}

type doctorSpecializationRepositoryPostgres struct {
	db Querier
}

func NewDoctorSpecializationRepositoryPostgres(db *sql.DB) *doctorSpecializationRepositoryPostgres {
	return &doctorSpecializationRepositoryPostgres{
		db: db,
	}
}

func (r *doctorSpecializationRepositoryPostgres) GetAll(ctx context.Context) ([]entity.DoctorSpecialization, error) {
	specializations := []entity.DoctorSpecialization{}

	queryGetSpecializations := `
	SELECT 
		id,
		name,
		description,
		image_url,
		slug
	FROM
		doctor_specializations
	WHERE 
		deleted_at IS NULL
	`

	rows, err := r.db.QueryContext(
		ctx,
		queryGetSpecializations,
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		specialization := entity.DoctorSpecialization{}
		err = rows.Scan(
			&specialization.Id,
			&specialization.Name,
			&specialization.Description,
			&specialization.ImageURL,
			&specialization.Slug)
		if err != nil {
			return nil, err
		}
		specializations = append(specializations, specialization)
	}

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return specializations, nil
}
