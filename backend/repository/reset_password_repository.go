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
	queryCreateResetPassword := `
		INSERT INTO
			reset_password_requests(
				token, 
				email)
			VALUES ($1, $2)
	`

	res, err := r.db.ExecContext(
		ctx,
		queryCreateResetPassword,
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
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *resetPasswordRepositoryPostgres) GetByToken(ctx context.Context, token string) (*entity.ResetPassword, error) {
	reset := entity.ResetPassword{}

	queryGetResetPassword := `
		SELECT
			id,
			email 
		FROM
			reset_password_requests
		WHERE 
			token = $1
		AND 
			deletedAt IS NULL 
	`

	err := r.db.QueryRowContext(
		ctx,
		queryGetResetPassword,
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
