package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type AddressRepository interface {
	CreateOneAddress(ctx context.Context, a *entity.Address) (*entity.Address, error)
	UpdateOneAddress(ctx context.Context, a *entity.Address) error
	DeleteOneAddress(ctx context.Context, a *entity.Address) error
	IsAddressExist(ctx context.Context, a *entity.Address) (bool, error)
	FindOneAddressIdByUserId(ctx context.Context, userId int64) (*int64, error)
}

type addressRepositoryPostgres struct {
	db Querier
}

func NewAdressRepositoryPostgres(db *sql.DB) *addressRepositoryPostgres {
	return &addressRepositoryPostgres{
		db: db,
	}
}

func (r *addressRepositoryPostgres) CreateOneAddress(ctx context.Context, a *entity.Address) (*entity.Address, error) {
	q := `
		INSERT INTO
			addresses(
				user_id,
				alias,
				city_id,
				detail,
				lng,
				lat,
				geom
			)
		VALUES 
			($1, $2, $3, $4, $5::decimal, $6::decimal, ST_SetSRID(ST_MakePoint($5, $6),4326))
		RETURNING 
			id
	`

	err := r.db.QueryRowContext(
		ctx,
		q,
		a.UserId,
		a.Alias,
		a.City.Id,
		a.Detail,
		a.Longitude,
		a.Latitude,
	).Scan(&a.Id)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return a, nil
}

func (r *addressRepositoryPostgres) UpdateOneAddress(ctx context.Context, a *entity.Address) error {
	var query strings.Builder
	var data []interface{}

	query.WriteString(`
		UPDATE
			addresses
		SET `)

	queryParams, paramsData := convertUpdateAddressToSql(*a)
	query.WriteString(queryParams)
	data = append(data, paramsData...)

	res, err := r.db.ExecContext(
		ctx,
		query.String(),
		data...,
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

func (r *addressRepositoryPostgres) DeleteOneAddress(ctx context.Context, a *entity.Address) error {
	query := `
		UPDATE
			addresses
		SET
			deleted_at = NOW(), updated_at = NOW()
		WHERE
			id = $1
		AND
			user_id = $2
		AND
			deleted_at IS NULL
	`

	res, err := r.db.ExecContext(
		ctx,
		query,
		*a.Id,
		*a.UserId,
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

func (r *addressRepositoryPostgres) IsAddressExist(ctx context.Context, a *entity.Address) (bool, error) {
	var isAddressExist bool

	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				addresses 
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
		*a.Id,
		*a.UserId,
	).Scan(
		&isAddressExist,
	)

	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isAddressExist, nil
}

func (r *addressRepositoryPostgres) FindOneAddressIdByUserId(ctx context.Context, userId int64) (*int64, error) {
	var addressId *int64

	query := `
		SELECT 
			id
		FROM 
			addresses 
		WHERE 
			user_id = $1
		AND 
			deleted_at IS NULL
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		userId,
	).Scan(
		&addressId,
	)

	if err != nil {
		return addressId, apperror.NewInternal(err)
	}

	return addressId, nil
}
