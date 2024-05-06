package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type ResetPasswordRepository interface {
	CreateNewResetPassword(ctx context.Context, token string, email string) error
	GetByToken(ctx context.Context, token string) (*entity.ResetPassword, error)
	DeleteResetPasswordTokenAfterExpired(ctx context.Context) error
	IsTokenResetHasUsed(ctx context.Context, token string) (bool, error)
	IsUserStillHaveValidToken(ctx context.Context, email string) (bool, error)
	DeleteResetPasswordTokenAfterUsed(ctx context.Context, token string) error
	GetByEmail(ctx context.Context, email string) (*entity.ResetPassword, error)
}

type resetPasswordRepositoryPostgres struct {
	db Querier
}

func NewResetPasswordRepositoryPostgres(db *sql.DB) *resetPasswordRepositoryPostgres {
	return &resetPasswordRepositoryPostgres{
		db: db,
	}
}

func (r *resetPasswordRepositoryPostgres) CreateNewResetPassword(ctx context.Context, token string, email string) error {
	queryCreateNewResetPassword := `
		INSERT INTO
			reset_password_requests(
				token, 
				email)
			VALUES ($1, $2)
	`

	res, err := r.db.ExecContext(
		ctx,
		queryCreateNewResetPassword,
		token,
		email,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return nil
	}

	return nil
}

func (r *resetPasswordRepositoryPostgres) GetByToken(ctx context.Context, token string) (*entity.ResetPassword, error) {
	reset := entity.ResetPassword{}

	queryGetByToken := `
		SELECT
			id,
			email 
		FROM
			reset_password_requests
		WHERE 
			token = $1
		AND 
			deleted_at IS NULL 
	`

	err := r.db.QueryRowContext(
		ctx,
		queryGetByToken,
		token,
	).Scan(
		&reset.Id,
		&reset.Email,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrInvalidToken(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &reset, nil
}

func (r *resetPasswordRepositoryPostgres) DeleteResetPasswordTokenAfterExpired(ctx context.Context) error {

	queryDeleteResetPasswordTokenAfterExpired := `
		UPDATE 
			reset_password_requests
		SET 
			deleted_at = now()
		WHERE 
			NOW() > expired_at
	`

	res, err := r.db.ExecContext(
		ctx,
		queryDeleteResetPasswordTokenAfterExpired,
	)

	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return nil
	}

	return nil
}

func (r *resetPasswordRepositoryPostgres) IsTokenResetHasUsed(ctx context.Context, token string) (bool, error) {
	var isTokenResetHasUsed bool
	queryIsTokenResetHasUsed := `
		SELECT EXISTS (
			SELECT
				1
			FROM
				reset_password_requests
			WHERE
				token = $1
			AND
				deleted_at IS NOT NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsTokenResetHasUsed,
		token,
	).Scan(
		&isTokenResetHasUsed,
	)

	if err != nil {
		return false, apperror.ErrInvalidToken(err)
	}

	return isTokenResetHasUsed, nil
}

func (r *resetPasswordRepositoryPostgres) IsUserStillHaveValidToken(ctx context.Context, email string) (bool, error) {
	var isUserHaveValidToken bool
	queryIsUserHaveValidToken := `
		SELECT EXISTS (
			SELECT
				1
			FROM
				reset_password_requests
			WHERE
				email = $1
			AND
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsUserHaveValidToken,
		email,
	).Scan(
		&isUserHaveValidToken,
	)

	if err != nil {
		return false, apperror.ErrInvalidToken(err)
	}

	return isUserHaveValidToken, nil
}

func (r *resetPasswordRepositoryPostgres) DeleteResetPasswordTokenAfterUsed(ctx context.Context, token string) error {

	queryDeleteResetPasswordTokenAfterUsed := `
		UPDATE 
			reset_password_requests
		SET 
			deleted_at = now()
		WHERE 
			token = $1
	`

	res, err := r.db.ExecContext(
		ctx,
		queryDeleteResetPasswordTokenAfterUsed,
		token,
	)

	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.ErrInvalidToken(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *resetPasswordRepositoryPostgres) GetByEmail(ctx context.Context, email string) (*entity.ResetPassword, error) {
	reset := entity.ResetPassword{}

	queryGetByEmail := `
		SELECT
			id,
			token
		FROM
			reset_password_requests
		WHERE 
			email = $1
	`

	err := r.db.QueryRowContext(
		ctx,
		queryGetByEmail,
		email,
	).Scan(
		&reset.Id,
		&reset.Token,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrEmailNotRegistered(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &reset, nil
}
