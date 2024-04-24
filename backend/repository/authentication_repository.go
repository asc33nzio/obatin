package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type AuthenticationRepository interface {
	FindAuthenticationByEmail(ctx context.Context, email string) (*entity.Authentication, error)
	IsEmailExist(ctx context.Context, email string) (bool, error)
	CreateOne(ctx context.Context, u entity.Authentication) (*entity.Authentication, error)
	VerifyEmail(ctx context.Context, token string) (*entity.Authentication, error)
	UpdateToken(ctx context.Context, token string, userId int) (*entity.Authentication, error)
	UpdatePassword(ctx context.Context, password string, token string) (*entity.Authentication, error)
	UpdateApproval(ctx context.Context, authId int, isApprove bool) (*entity.Authentication, error)
	GetById(ctx context.Context, authId int) (*entity.Authentication, error)
	IsVerified(ctx context.Context, email string) (bool, error)
	GetPendingDoctorApproval(ctx context.Context) ([]entity.Doctor, error)
	IsTokenHasUsed(ctx context.Context, token string) (bool, error)
	IsApproved(ctx context.Context, email string) (bool, error)
}

type authenticationRepositoryPostgres struct {
	db Querier
}

func NewAuthenticationRepositoryPostgres(db *sql.DB) *authenticationRepositoryPostgres {
	return &authenticationRepositoryPostgres{
		db: db,
	}
}

func (r *authenticationRepositoryPostgres) FindAuthenticationByEmail(ctx context.Context, email string) (*entity.Authentication, error) {
	AuthenticationId := entity.Authentication{}

	queryFindAuthentication := `
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
		queryFindAuthentication,
		email,
	).Scan(
		&AuthenticationId.Id,
		&AuthenticationId.Email,
		&AuthenticationId.Password,
		&AuthenticationId.Token,
		&AuthenticationId.IsVerified,
		&AuthenticationId.Role,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrEmailNotRegistered(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &AuthenticationId, nil
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
			AND 
				deletedAt IS NULL
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
	queryCreateAuthentication := `
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
		queryCreateAuthentication,
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

func (r *authenticationRepositoryPostgres) VerifyEmail(ctx context.Context, token string) (*entity.Authentication, error) {
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
			email, 
			role
	`

	err := r.db.QueryRowContext(
		ctx,
		queryVerifiedEmail,
		token,
	).Scan(
		&user.Id,
		&user.Email,
		&user.Role,
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
		Role:  user.Role,
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

func (r *authenticationRepositoryPostgres) UpdatePassword(ctx context.Context, password string, email string) (*entity.Authentication, error) {
	user := entity.Authentication{}

	queryUpdatePassword := `
		UPDATE 
			authentications
		SET 
			password = $1
		WHERE 
			email = $2
		AND 
			is_approved = true
		AND 
			is_verified = true
		AND 
			deletedAt IS NULL
		RETURNING 
			id, 
			email
	`

	err := r.db.QueryRowContext(
		ctx,
		queryUpdatePassword,
		password,
		email,
	).Scan(
		&user.Id,
		&user.Email,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrEmailNotRegistered(err)
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

	var queryUpdateApproval string
	if isApprove {
		queryUpdateApproval = `
		UPDATE 
			authentications
		SET 
			is_approved = $2,
		WHERE 
			id = $1 
		AND 
			role = 'doctor'
		AND
			deletedAt IS NULL
		RETURNING 
			id, 
			email
	`
	} else {
		queryUpdateApproval = `
		UPDATE 
			authentications
		SET 
			is_approved = $2,
			deletedAt = now()
		WHERE 
			id = $1 
		AND 
			role = 'doctor'
		AND
			deletedAt IS NULL
		RETURNING 
			id, 
			email
	`
	}

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
			return nil, apperror.ErrEmailNotRegistered(err)
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

	queryGetById := `
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
		queryGetById,
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

func (r *authenticationRepositoryPostgres) IsVerified(ctx context.Context, email string) (bool, error) {
	var isVerified bool
	queryIsVerified := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				authentications 
			WHERE 
				email = $1
			AND
				is_verified = true
			AND 
				deletedAt IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsVerified,
		email,
	).Scan(
		&isVerified,
	)

	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isVerified, nil
}

func (r *authenticationRepositoryPostgres) GetPendingDoctorApproval(ctx context.Context) ([]entity.Doctor, error) {
	doctors := []entity.Doctor{}

	queryGetPendingDoctorApproval := `
	SELECT 
		a.id,
		a.email,
		d.certificate_url,
		ds.name,
		ds.description
	FROM
		authentications a
	JOIN
		doctors d
	ON
		a.id = d.authentication_id
	JOIN 
		doctor_specializations ds
	ON 
		d.doctor_specialization_id = ds.id
	WHERE 
		a.role = 'doctor'
	AND
		a.is_approved = false
	AND 	
		a.deletedAt IS NULL
	`

	rows, err := r.db.QueryContext(
		ctx,
		queryGetPendingDoctorApproval,
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		doctor := entity.Doctor{}
		err = rows.Scan(
			&doctor.AuthenticationID,
			&doctor.Email,
			&doctor.Certificate,
			&doctor.SpecializationName,
			&doctor.SpecializationDescription,
		)
		if err != nil {
			return nil, err
		}
		doctors = append(doctors, doctor)
	}

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return doctors, nil
}

func (r *authenticationRepositoryPostgres) IsTokenHasUsed(ctx context.Context, token string) (bool, error) {
	var isTokenHasUsed bool
	queryIsTokenHasUsed := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				authentications 
			WHERE 
				token = $1
			AND
				is_verified = TRUE
			AND 
				deletedAt IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsTokenHasUsed,
		token,
	).Scan(
		&isTokenHasUsed,
	)

	if err != nil {
		return false, apperror.ErrInvalidToken(err)
	}

	return isTokenHasUsed, nil
}

func (r *authenticationRepositoryPostgres) IsApproved(ctx context.Context, email string) (bool, error) {
	var isApproved bool
	queryIsApproved := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				authentications 
			WHERE 
				email = $1
			AND
				is_approved = true
			AND 
				deletedAt IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsApproved,
		email,
	).Scan(
		&isApproved,
	)

	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isApproved, nil
}
