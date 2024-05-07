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
	FindAllPrescriptionItems(ctx context.Context, prescriptionId int64) ([]*entity.PrescriptionItem, error)
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

func (r *prescriptionItemRepositoryPostgres) FindAllPrescriptionItems(ctx context.Context, prescriptionId int64) ([]*entity.PrescriptionItem, error) {
	res := []*entity.PrescriptionItem{}

	query := `
		SELECT
			pr.id,
			pr.user_id,
			pr.doctor_id,
			pi.id,
			pi.product_id,
			pi.amount,
			p.name,
			p.product_slug,
			p.image_url,
			p.thumbnail_url,
			p.classification,
			p.selling_unit,
			d.name,
			d.doctor_specialization_id,
			d.is_online,
			ds.name,
			u.name,
			u.birth_date,
			u.gender,
			pr.created_at
		FROM
			prescription_items pi
		JOIN
			products p
		ON
			pi.product_id = p.id
		AND
			p.deleted_at IS NULL
		AND
			p.is_active = true
		JOIN
			prescriptions pr
		ON
			pi.prescription_id = pr.id
		JOIN
			doctors d
		ON
			pr.doctor_id = d.id
		JOIN
			doctor_specializations ds
		ON
			d.doctor_specialization_id = ds.id
		JOIN
			users u
		ON
			pr.user_id = u.id
		WHERE
			pi.prescription_id = $1
		AND
			pi.deleted_at IS NULL
		
	`

	rows, err := r.db.QueryContext(
		ctx,
		query,
		prescriptionId,
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		pi := entity.PrescriptionItem{}
		err = rows.Scan(
			&pi.Prescription.Id,
			&pi.Prescription.User.Id,
			&pi.Prescription.Doctor.Id,
			&pi.Id,
			&pi.Product.Id,
			&pi.Amount,
			&pi.Product.Name,
			&pi.Product.Slug,
			&pi.Product.ImageUrl,
			&pi.Product.ThumbnailUrl,
			&pi.Product.Classification,
			&pi.Product.SellingUnit,
			&pi.Prescription.Doctor.Name,
			&pi.Prescription.Doctor.Specialization,
			&pi.Prescription.Doctor.IsOnline,
			&pi.Prescription.Doctor.SpecializationName,
			&pi.Prescription.User.Name,
			&pi.Prescription.User.BirthDate,
			&pi.Prescription.User.Gender,
			&pi.Prescription.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		res = append(res, &pi)
	}

	return res, nil
}
