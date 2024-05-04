package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type UserRepository interface {
	CreateNewUser(ctx context.Context, authentiactionId int64) error
	FindUserById(ctx context.Context, userId int64) (*entity.User, error)
	FindUserByAuthId(ctx context.Context, authenticationId int64) (*entity.User, error)
	FindUserIdByAuthId(ctx context.Context, authenticationId int64) (*int64, error)
	FindUserDetailsByAuthId(ctx context.Context, authenticationId int64) (*entity.User, error)
	UpdateOneUserDetails(ctx context.Context, userUpdated *entity.UpdateUser) error
	HasActiveAddress(ctx context.Context, authenticationId int64) (bool, error)
	IsUserExistByAuthId(ctx context.Context, authenticationId int64) (bool, error)
	RemoveActiveAddressId(ctx context.Context, authenticationId int64) error
	DeleteOneUserByAuthId(ctx context.Context, authenticationId int64) error
}

type userRepositoryPostgres struct {
	db Querier
}

func NewUserRepositoryPostgres(db *sql.DB) *userRepositoryPostgres {
	return &userRepositoryPostgres{
		db: db,
	}
}

func (r *userRepositoryPostgres) CreateNewUser(ctx context.Context, authentiactionId int64) error {
	q := `
		INSERT INTO
			users(authentication_id)
		VALUES ($1)
	`

	res, err := r.db.ExecContext(
		ctx,
		q,
		authentiactionId,
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

func (r *userRepositoryPostgres) FindUserById(ctx context.Context, userId int64) (*entity.User, error) {
	user := entity.User{}

	queryFindUser := `
	SELECT 
		id,
		name,
		birth_date,
		gender,
		avatar_url,
		authentication_id
	FROM
		users
	WHERE
		id = $1
	`

	err := r.db.QueryRowContext(
		ctx,
		queryFindUser,
		userId,
	).Scan(
		&user.Id,
		&user.Name,
		&user.BirthDate,
		&user.Gender,
		&user.Avatar,
		&user.Authentication.Id,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrUserNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &user, nil
}

func (r *userRepositoryPostgres) FindUserByAuthId(ctx context.Context, authenticationId int64) (*entity.User, error) {
	user := entity.User{}
	user.Authentication.Id = authenticationId

	q := `
		SELECT 
			id,
			name,
			birth_date,
			gender,
			active_address_id
		FROM
			users
		WHERE
			authentication_id = $1
		AND
			deleted_at IS NULL
	`

	err := r.db.QueryRowContext(
		ctx,
		q,
		authenticationId,
	).Scan(
		&user.Id,
		&user.Name,
		&user.BirthDate,
		&user.Gender,
		&user.ActiveAddress.Id,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrUserNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &user, nil
}

func (r *userRepositoryPostgres) FindUserIdByAuthId(ctx context.Context, authenticationId int64) (*int64, error) {
	var userId *int64

	q := `
		SELECT 
			id
		FROM
			users
		WHERE
			authentication_id = $1
		AND
			deleted_at IS NULL
	`

	err := r.db.QueryRowContext(
		ctx,
		q,
		authenticationId,
	).Scan(
		&userId,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrUserNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return userId, nil
}

func (r *userRepositoryPostgres) FindUserDetailsByAuthId(ctx context.Context, authenticationId int64) (*entity.User, error) {
	user := entity.User{}
	user.Authentication.Id = authenticationId

	query := `
		SELECT 
			u.id,
			u.name,
			u.birth_date::date,
			u.gender,
			u.avatar_url,
			u.active_address_id,
			a.email,
			ad.id,
			ad.alias,
			ad.detail,
			ad.lat,
			ad.lng,
			c.id,
			c.name,
			c.postal_code,
			c.type,
			p.id,
			p.name
		FROM
			users u
		LEFT JOIN
			authentications a
		ON
			u.authentication_id = a.id
		AND
			a.deleted_at IS NULL
		LEFT JOIN
			addresses ad 
		ON
			ad.user_id = u.id
		AND
			ad.deleted_at IS NULL
		LEFT JOIN
			cities c
		ON 
			ad.city_id = c.id
		LEFT JOIN
			provinces p
		ON
			c.province_id = p.id
		WHERE
			u.authentication_id = $1
		AND
			u.deleted_at IS NULL
	`

	rows, err := r.db.QueryContext(ctx, query, authenticationId)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		address := entity.Address{}
		err := rows.Scan(
			&user.Id,
			&user.Name,
			&user.BirthDate,
			&user.Gender,
			&user.Avatar,
			&user.ActiveAddress.Id,
			&user.Authentication.Email,
			&address.Id,
			&address.Alias,
			&address.Detail,
			&address.Latitude,
			&address.Longitude,
			&address.City.Id,
			&address.City.Name,
			&address.City.PostalCode,
			&address.City.Type,
			&address.City.Province.Id,
			&address.City.Province.Name,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		user.Addresses = append(user.Addresses, address)
	}

	return &user, nil
}

func (r *userRepositoryPostgres) UpdateOneUserDetails(ctx context.Context, userUpdated *entity.UpdateUser) error {
	var query strings.Builder
	var data []interface{}

	query.WriteString(`
		UPDATE
			users
		SET `)

	queryParams, paramsData := convertUpdateUserDetailsToSql(*userUpdated)
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

func (r *userRepositoryPostgres) HasActiveAddress(ctx context.Context, authenticationId int64) (bool, error) {
	var hasActiveAddress bool

	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				users 
			WHERE 
				authentication_id = $1
			AND
				active_address_id IS NOT NULL
			AND 
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		authenticationId,
	).Scan(
		&hasActiveAddress,
	)

	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return hasActiveAddress, nil
}

func (r *userRepositoryPostgres) IsUserExistByAuthId(ctx context.Context, authenticationId int64) (bool, error) {
	var isUserExist bool

	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				users 
			WHERE 
				authentication_id = $1
			AND 
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		authenticationId,
	).Scan(
		&isUserExist,
	)

	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isUserExist, nil
}

func (r *userRepositoryPostgres) RemoveActiveAddressId(ctx context.Context, authenticationId int64) error {
	query := `
		UPDATE
			users
		SET 
			active_address_id = NULL , updated_at = NOW()
		WHERE
			authentication_id = $1
		AND
			deleted_at IS NULL
	`

	res, err := r.db.ExecContext(
		ctx,
		query,
		authenticationId,
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

func (r *userRepositoryPostgres) DeleteOneUserByAuthId(ctx context.Context, authenticationId int64) error {
	query := `
		UPDATE
			users
		SET 
			deleted_at = NOW() , updated_at = NOW()
		WHERE
			authentication_id = $1
		AND
			deleted_at IS NULL
	`

	res, err := r.db.ExecContext(
		ctx,
		query,
		authenticationId,
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
