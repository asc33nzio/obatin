package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type AuthenticationRepository interface {
	FindUserByEmail(ctx context.Context, email string) (*entity.Authentication, error)
	IsEmailExist(ctx context.Context, email string) (bool, error)
	CreateOne(ctx context.Context, u entity.Authentication) (*entity.Authentication, error)
	VerifiedEmail(ctx context.Context, token string) (*entity.Authentication, error)
	UpdateToken(ctx context.Context, token string, userId int) (*entity.Authentication, error)
	UpdatePassword(ctx context.Context, password string, token string) (*entity.Authentication, error)
	UpdateApproval(ctx context.Context, authId int, isApprove bool) (*entity.Authentication, error)
	GetById(ctx context.Context, authId int) (*entity.Authentication, error)
}

type authenticationRepositoryPostgres struct {
	db Querier
}

func NewAuthenticationRepositoryPostgres(db *sql.DB) *authenticationRepositoryPostgres {
	return &authenticationRepositoryPostgres{
		db: db,
	}
}

func (r *authenticationRepositoryPostgres) FindUserByEmail(ctx context.Context, email string) (*entity.Authentication, error) {
	user := entity.Authentication{}

	queryFindUser := `
	SELECT 
		id,
		email,
		password,
		token,
		is_verified,
		role
	FROM
		authentications
	WHERE
		email = $1
	`

	err := r.db.QueryRowContext(
		ctx,
		queryFindUser,
		email,
	).Scan(
		&user.Id,
		&user.Email,
		&user.Password,
		&user.Token,
		&user.IsVerified,
		&user.Role,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrEmailNotRegistered(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &user, nil
}

func (r *authenticationRepositoryPostgres) IsEmailExist(ctx context.Context, email string) (bool, error) {
	var isExist bool
	queryIsEmailExist := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				authentications 
			WHERE 
				email = $1
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsEmailExist,
		email,
	).Scan(
		&isExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isExist, nil
}

func (r *authenticationRepositoryPostgres) CreateOne(ctx context.Context, u entity.Authentication) (*entity.Authentication, error) {
	queryCreateUser := `
		INSERT INTO
			authentications(
				email,
				password,
				token,
				role,
				is_approved)
			VALUES 
				($1, $2, $3, $4, $5)
		RETURNING 
			id
	`

	err := r.db.QueryRowContext(
		ctx,
		queryCreateUser,
		u.Email,
		u.Password,
		u.Token,
		u.Role,
		u.IsApproved,
	).Scan(&u.Id)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &entity.Authentication{
		Id:    u.Id,
		Email: u.Email,
		Token: u.Token,
	}, nil
}

func (r *authenticationRepositoryPostgres) VerifiedEmail(ctx context.Context, token string) (*entity.Authentication, error) {
	user := entity.Authentication{}

	queryVerifiedEmail := `
		UPDATE 
			authentications
		SET 
			is_verified = true
		WHERE 
			token = $1 
		AND 
			is_approved = true
		RETURNING 
			id, 
			email
	`

	err := r.db.QueryRowContext(
		ctx,
		queryVerifiedEmail,
		token,
	).Scan(
		&user.Id,
		&user.Email,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrInvalidToken(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &entity.Authentication{
		Id:    user.Id,
		Email: user.Email,
	}, nil
}

func (r *authenticationRepositoryPostgres) UpdateToken(ctx context.Context, token string, authenticationId int) (*entity.Authentication, error) {
	user := entity.Authentication{}

	queryUpdateToken := `
		UPDATE 
			authentications
		SET 
			token = $1
		WHERE 
			id  = $2 
		AND 
			is_approved = true
		RETURNING 
			id, 
			email
	`

	err := r.db.QueryRowContext(
		ctx,
		queryUpdateToken,
		token,
		authenticationId,
	).Scan(
		&user.Id,
		&user.Email,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrInvalidReq(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &entity.Authentication{
		Id:    user.Id,
		Email: user.Email,
	}, nil
}

func (r *authenticationRepositoryPostgres) UpdatePassword(ctx context.Context, password string, token string) (*entity.Authentication, error) {
	user := entity.Authentication{}

	queryUpdatePassword := `
		UPDATE 
			authentications
		SET 
			password = $1
		WHERE 
			token = $2
		AND 
			is_approved = true
		AND 
			is_verified = true
		RETURNING 
			id, 
			email
	`

	err := r.db.QueryRowContext(
		ctx,
		queryUpdatePassword,
		password,
		token,
	).Scan(
		&user.Id,
		&user.Email,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrInvalidReq(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &entity.Authentication{
		Id:    user.Id,
		Email: user.Email,
	}, nil
}

func (r *authenticationRepositoryPostgres) UpdateApproval(ctx context.Context, authId int, isApprove bool) (*entity.Authentication, error) {
	user := entity.Authentication{}

	queryUpdateApproval := `
		UPDATE 
			authentications
		SET 
			is_approved = $2,
			deletedAt = now()
		WHERE 
			id = $1 
		AND 
			deletedAt IS NULL
		RETURNING 
			id, 
			email
	`

	err := r.db.QueryRowContext(
		ctx,
		queryUpdateApproval,
		authId,
		isApprove,
	).Scan(
		&user.Id,
		&user.Email,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrInvalidReq(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &entity.Authentication{
		Id:    user.Id,
		Email: user.Email,
	}, nil
}

func (r *authenticationRepositoryPostgres) GetById(ctx context.Context, authId int) (*entity.Authentication, error) {
	user := entity.Authentication{}

	queryFindUser := `
	SELECT 
		id,
		email,
		password,
		token,
		is_verified,
		role
	FROM
		authentications
	WHERE
		id = $1
	`

	err := r.db.QueryRowContext(
		ctx,
		queryFindUser,
		authId,
	).Scan(
		&user.Id,
		&user.Email,
		&user.Password,
		&user.Token,
		&user.IsVerified,
		&user.Role,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrEmailNotRegistered(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &user, nil
}
