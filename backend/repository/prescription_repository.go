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
	FindAllUserPrescriptions(ctx context.Context, userId int64) ([]*entity.Prescription, error)
	FindAllDoctorPrescriptions(ctx context.Context, doctorId int64) ([]*entity.Prescription, error)
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

func (r *prescriptionRepositoryPostgres) FindAllUserPrescriptions(ctx context.Context, userId int64) ([]*entity.Prescription, error) {
	res := []*entity.Prescription{}

	query := `
		SELECT
			p.id,
			p.user_id,
			p.doctor_id,
			p.is_redeemed,
			d.name,
			d.doctor_specialization_id,
			ds.name,
			d.is_online,
			p.created_at
		FROM
			prescriptions p
		JOIN
			doctors d
		ON
			p.doctor_id = d.id
		AND
			d.deleted_at IS NULL
		JOIN
			doctor_specializations ds
		ON
			d.doctor_specialization_id = ds.id
		AND
			ds.deleted_at IS NULL
		WHERE
			p.user_id = $1
		AND
			p.deleted_at IS NULL
		ORDER BY
			p.created_at DESC
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
		p := entity.Prescription{}
		err = rows.Scan(
			&p.Id,
			&p.User.Id,
			&p.Doctor.Id,
			&p.IsRedeemed,
			&p.Doctor.Name,
			&p.Doctor.Specialization,
			&p.Doctor.SpecializationName,
			&p.Doctor.IsOnline,
			&p.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		res = append(res, &p)
	}

	return res, nil
}

func (r *prescriptionRepositoryPostgres) FindAllDoctorPrescriptions(ctx context.Context, doctorId int64) ([]*entity.Prescription, error) {
	res := []*entity.Prescription{}

	query := `
		SELECT
			p.id,
			p.user_id,
			p.doctor_id,
			p.is_redeemed,
			u.name,
			u.birth_date,
			u.gender,
			p.created_at
		FROM
			prescriptions p
		JOIN
			users u
		ON
			p.user_id = u.id
		AND
			u.deleted_at IS NULL
		WHERE
			p.doctor_id = $1
		AND
			p.deleted_at IS NULL
		ORDER BY
			p.created_at DESC
	`

	rows, err := r.db.QueryContext(
		ctx,
		query,
		doctorId,
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		p := entity.Prescription{}
		err = rows.Scan(
			&p.Id,
			&p.User.Id,
			&p.Doctor.Id,
			&p.IsRedeemed,
			&p.User.Name,
			&p.User.BirthDate,
			&p.User.Gender,
			&p.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		res = append(res, &p)
	}

	return res, nil
}
