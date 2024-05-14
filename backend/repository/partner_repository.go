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

type PartnerRepository interface {
	CreateOne(ctx context.Context, u entity.Partner) (*entity.Partner, error)
	IsPartnerExist(ctx context.Context, name string) (bool, error)
	GetPartnerList(ctx context.Context, params entity.PartnerFilter) (*entity.PartnerListPage, error)
	UpdateOnePartner(ctx context.Context, body entity.PartnerUpdateRequest, id int64) (*entity.Partner, error)
	IsPartnerExistUpdate(ctx context.Context, name string, id int64) (int, error)
	FindPartnerById(ctx context.Context, id int64) (*entity.Partner, error)
	FindPartnerIdByAuthId(ctx context.Context, authId int64) (*int64, error)
}

type partnerRepositoryPostgres struct {
	db Querier
}

func NewPartnerRepositoryPostgres(db *sql.DB) *partnerRepositoryPostgres {
	return &partnerRepositoryPostgres{
		db: db,
	}
}

func (r *partnerRepositoryPostgres) CreateOne(ctx context.Context, u entity.Partner) (*entity.Partner, error) {
	queryCreatePartner := `
		INSERT INTO
			partners(
				name,
				logo_url,
				authentication_id
				)
			VALUES 
				($1, $2, $3)
		RETURNING 
			id
	`

	err := r.db.QueryRowContext(
		ctx,
		queryCreatePartner,
		u.Name,
		u.LogoURL,
		u.AuthenticationId,
	).Scan(&u.Id)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &entity.Partner{
		Id: u.Id,
	}, nil
}

func (r *partnerRepositoryPostgres) IsPartnerExist(ctx context.Context, name string) (bool, error) {
	var isPartnerExist bool
	queryIsEmailExist := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				partners 
			WHERE 
				name = $1
			AND 
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsEmailExist,
		name,
	).Scan(
		&isPartnerExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isPartnerExist, nil
}

func (r *partnerRepositoryPostgres) GetPartnerList(ctx context.Context, params entity.PartnerFilter) (*entity.PartnerListPage, error) {
	paramsCount := appconstant.StartingParamsCount
	res := []entity.Partner{}
	var sb strings.Builder
	rowsCount := 0
	var queryDataCount strings.Builder
	var data []interface{}

	sb.WriteString(`
		SELECT DISTINCT 
			p.id, p.authentication_id, p.name, p.logo_url
		FROM 
			partners p 
		WHERE
			p.deleted_at IS NULL
	`)

	queryParams, paramsData := convertPartnerQueryParamstoSql(params)
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
	paginationParams, paginationData := convertPaginationPartnerParamsToSql(params, paramsCount)
	sb.WriteString(paginationParams)
	data = append(data, paginationData...)
	rows, err := r.db.QueryContext(ctx, sb.String(), data...)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		partner := entity.Partner{}
		err := rows.Scan(&partner.Id, &partner.AuthenticationId, &partner.Name, &partner.LogoURL)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		res = append(res, partner)
	}
	return &entity.PartnerListPage{
		Partners:  res,
		TotalRows: rowsCount,
	}, nil
}

func (r *partnerRepositoryPostgres) UpdateOnePartner(ctx context.Context, body entity.PartnerUpdateRequest, id int64) (*entity.Partner, error) {
	partner := entity.Partner{}
	var query strings.Builder
	var data []interface{}

	query.WriteString(`
		UPDATE
			partners
		SET `)

	queryParams, paramsData := convertUpdatePartnerQueryParamstoSql(body, id)
	query.WriteString(queryParams)
	data = append(data, paramsData...)

	err := r.db.QueryRowContext(ctx, query.String(), data...).
		Scan(&partner.Id, &partner.Name, &partner.LogoURL)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &partner, nil
}

func (r *partnerRepositoryPostgres) IsPartnerExistUpdate(ctx context.Context, name string, id int64) (int, error) {
	var count int
	queryIsNameExist := `
	SELECT 
		COUNT(*)
	FROM 
		partners 
	WHERE 
		name = $1
	AND 
		id<>$2
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsNameExist,
		name,
		id,
	).Scan(
		&count,
	)
	if err != nil {
		return 0, apperror.NewInternal(err)
	}

	return count, nil
}

func (r *partnerRepositoryPostgres) FindPartnerById(ctx context.Context, id int64) (*entity.Partner, error) {
	res := entity.Partner{}

	q := `
		SELECT 
			p.id,     
			p.name,
			p.authentication_id,
			p.logo_url,
			a.email,
			a.password
		FROM 
			partners p 
		JOIN
			authentications a
		ON 
			p.authentication_id = a.id
		WHERE
			p.id = $1
		AND
		    p.deleted_at IS NULL

	`
	err := r.db.QueryRowContext(ctx, q, id).Scan(
		&res.Id,
		&res.Name,
		&res.AuthenticationId,
		&res.LogoURL,
		&res.Email,
		&res.Password,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrPartnerNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &res, nil
}

func (r *partnerRepositoryPostgres) FindPartnerIdByAuthId(ctx context.Context, authId int64) (*int64, error) {
	var id int64

	q := `
		SELECT 
			p.id
		FROM 
			partners p 
		WHERE
			p.authentication_id = $1
		AND
		p.deleted_at IS NULL

`
	err := r.db.QueryRowContext(ctx, q, authId).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrPartnerNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &id, nil
}
