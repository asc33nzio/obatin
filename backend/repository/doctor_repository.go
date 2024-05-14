package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type DoctorRepository interface {
	CreateNewDoctor(ctx context.Context, authentiactionId int64, certificate string, doctorSpecializationId int) error
	GetDoctorList(ctx context.Context, params entity.DoctorFilter) (*entity.DoctorListPage, error)
	FindDoctorDetailById(ctx context.Context, id int64) (*entity.DoctorDetail, error)
	FindDoctorDetailByAuthIdRedacted(ctx context.Context, id int64) (*entity.DoctorDetail, error)
	UpdateOneDoctor(ctx context.Context, body entity.DoctorUpdateRequest, id int64) (*entity.DoctorDetail, error)
	FindDoctorByAuthId(ctx context.Context, authId int64) (*entity.Doctor, error)
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
		VALUES ($1,
			 	$2, 
				$3)
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
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *doctorRepositoryPostgres) GetDoctorList(ctx context.Context, params entity.DoctorFilter) (*entity.DoctorListPage, error) {
	paramsCount := appconstant.StartingParamsCount
	res := []entity.DoctorList{}
	var sb strings.Builder
	rowsCount := 0
	var queryDataCount strings.Builder
	var data []interface{}

	sb.WriteString(`
        SELECT
            d.id,
            sp.name,
			d.name,
			d.avatar_url,
			d.is_online,
			d.experience_years,
			d.fee,
			d.opening_time,
			d.operational_hours,
			d.operational_days
        FROM
            doctors d
        JOIN
            doctor_specializations sp
        ON
            d.doctor_specialization_id = sp.id
            `)
	queryParams, paramsData := convertDoctorQueryParamstoSql(params)
	sb.WriteString(queryParams)

	data = append(data, paramsData...)
	queryDataCount.WriteString(fmt.Sprintf(` SELECT COUNT (*) FROM ( %v )`, sb.String()))
	err := r.db.QueryRowContext(ctx, queryDataCount.String(), data...).Scan(&rowsCount)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	if len(data) > 0 {
		paramsCount = len(data) + 1
	}
	paginationParams, paginationData := convertPaginationParamsToSql(params.Limit, params.Page, paramsCount)
	sb.WriteString(paginationParams)

	data = append(data, paginationData...)
	rows, err := r.db.QueryContext(ctx, sb.String(), data...)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		doctor := entity.DoctorList{}
		err := rows.Scan(&doctor.Id, &doctor.Specialization, &doctor.Name, &doctor.Avatar, &doctor.IsOnline,
			&doctor.Experiences, &doctor.Fee, &doctor.Opening, &doctor.OperationalHours, &doctor.OperationalDays)
		if err != nil {
			return nil, err
		}
		res = append(res, doctor)
	}

	return &entity.DoctorListPage{
		Doctors:   res,
		TotalRows: rowsCount,
	}, nil
}

func (r *doctorRepositoryPostgres) FindDoctorDetailById(ctx context.Context, id int64) (*entity.DoctorDetail, error) {
	res := entity.DoctorDetail{}

	q := `
		SELECT
			d.id,
			sp.name,
			d.name,
			d.avatar_url,
			d.is_online,
			d.experience_years,
			d.certificate_url,
			d.fee,
			d.opening_time,
			d.operational_hours,
			d.operational_days
		FROM 
			doctors d
		JOIN
			doctor_specializations sp
		ON 
			d.doctor_specialization_id = sp.id
		WHERE 
			d.id = $1
		AND
			d.deleted_at IS NULL
		
	`

	err := r.db.QueryRowContext(
		ctx,
		q,
		id,
	).Scan(&res.Id,
		&res.SpecializationName,
		&res.Name,
		&res.Avatar,
		&res.IsOnline,
		&res.Experiences,
		&res.Certificate,
		&res.Fee,
		&res.Opening,
		&res.OperationalHours,
		&res.OperationalDays)

	if err != nil {

		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &res, nil
}

func (r *doctorRepositoryPostgres) FindDoctorDetailByAuthIdRedacted(ctx context.Context, id int64) (*entity.DoctorDetail, error) {
	res := entity.DoctorDetail{}

	q := `
		SELECT
			d.id,
			sp.name,
			d.name,
			d.avatar_url,
			d.is_online,
			d.experience_years,
			d.certificate_url,
			d.fee,
			d.opening_time,
			d.operational_hours,
			d.operational_days
		FROM 
			doctors d
		JOIN
			authentications a
		ON
			a.id = d.authentication_id
		JOIN
			doctor_specializations sp
		ON
			d.doctor_specialization_id = sp.id
		WHERE
			authentication_id = $1
		
	`

	err := r.db.QueryRowContext(
		ctx,
		q,
		id,
	).Scan(&res.Id,
		&res.SpecializationName,
		&res.Name,
		&res.Avatar,
		&res.IsOnline,
		&res.Experiences,
		&res.Certificate,
		&res.Fee,
		&res.Opening,
		&res.OperationalHours,
		&res.OperationalDays)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.NewProductNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &res, nil
}

func (r *doctorRepositoryPostgres) UpdateOneDoctor(ctx context.Context, body entity.DoctorUpdateRequest, id int64) (*entity.DoctorDetail, error) {
	doctor := entity.DoctorDetail{}
	var q strings.Builder
	var data []interface{}

	q.WriteString(`
        UPDATE
            doctors
        SET
            `)

	queryParams, paramsData := convertUpdateDoctorQueryParamstoSql(body, id)
	q.WriteString(queryParams)
	data = append(data, paramsData...)
	err := r.db.QueryRowContext(
		ctx,
		q.String(),
		data...,
	).Scan(&doctor.Id,
		&doctor.Name,
		&doctor.Avatar,
		&doctor.IsOnline,
		&doctor.Experiences,
		&doctor.Certificate,
		&doctor.Fee,
		&doctor.Opening,
		&doctor.OperationalHours,
		&doctor.OperationalDays)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &doctor, nil
}

func (r *doctorRepositoryPostgres) FindDoctorByAuthId(ctx context.Context, authId int64) (*entity.Doctor, error) {
	doctor := entity.Doctor{}

	queryFindUser := `
	SELECT 
		d.id,
		d.name,
		d.avatar_url,
		d.is_online,
		d.experience_years,
		d.certificate_url,
		d.fee,
		d.opening_time,
		d.operational_hours,
		d.operational_days,
		a.email,
		sp.name
	FROM
		doctors d 
	JOIN
		authentications a
	ON
		a.id = d.authentication_id
	JOIN
		doctor_specializations sp
	ON
		d.doctor_specialization_id = sp.id
	WHERE
		authentication_id = $1
	`

	err := r.db.QueryRowContext(
		ctx,
		queryFindUser,
		authId,
	).Scan(
		&doctor.Id,
		&doctor.Name,
		&doctor.Avatar,
		&doctor.IsOnline,
		&doctor.Experiences,
		&doctor.Certificate,
		&doctor.Fee,
		&doctor.Opening,
		&doctor.OperationalHours,
		&doctor.OperationalDays,
		&doctor.Email,
		&doctor.SpecializationName,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrDoctorNotFound(err)
		}
		return nil, apperror.NewInternal(err)
	}

	return &doctor, nil
}
