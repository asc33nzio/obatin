package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type RefreshTokenRepository interface {
	CreateNewRefreshToken(ctx context.Context, token string, authId int) error
	DeleteRefreshTokenAfterExpired(ctx context.Context) error
	IsRefreshTokenValidByEmail(ctx context.Context, email string) (bool, error)
	IsRefreshTokenValidByToken(ctx context.Context, token string) (bool, error)
	GetByEmail(ctx context.Context, email string) (*entity.RefreshToken, error)
}

type refreshTokenRepositoryPostgres struct {
	db Querier
}

func NewRefreshTokenRepositoryPostgres(db *sql.DB) *refreshTokenRepositoryPostgres {
	return &refreshTokenRepositoryPostgres{
		db: db,
	}
}

func (r *refreshTokenRepositoryPostgres) CreateNewRefreshToken(ctx context.Context, token string, authId int) error {
	queryCreateNewRefreshToken := `
		INSERT INTO
			refresh_tokens(
				token, 
				authentication_id
			)
			VALUES ($1, $2)
	`

	res, err := r.db.ExecContext(
		ctx,
		queryCreateNewRefreshToken,
		token,
		authId,
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

func (r *refreshTokenRepositoryPostgres) DeleteRefreshTokenAfterExpired(ctx context.Context) error {
	queryDeleteRefreshTokenAfterExpired := `
		UPDATE 
			refresh_tokens
		SET 
			deletedAt = now()
		WHERE 
			NOW() > expired_at
	`

	res, err := r.db.ExecContext(
		ctx,
		queryDeleteRefreshTokenAfterExpired,
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

func (r *refreshTokenRepositoryPostgres) IsRefreshTokenValidByToken(ctx context.Context, token string) (bool, error) {
	var isRefreshTokenValid bool
	queryIsRefreshTokenValidByToken := `
		SELECT EXISTS (
			SELECT
				1
			FROM
				refresh_tokens
			WHERE
				token = $1
			AND
				deletedAt IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsRefreshTokenValidByToken,
		token,
	).Scan(
		&isRefreshTokenValid,
	)

	if err != nil {
		return false, apperror.ErrInvalidToken(err)
	}

	return isRefreshTokenValid, nil
}

func (r *refreshTokenRepositoryPostgres) IsRefreshTokenValidByEmail(ctx context.Context, email string) (bool, error) {
	var isRefreshTokenValid bool
	queryIsRefreshTokenValidByEmail := `
		SELECT EXISTS (
			SELECT
				1
			FROM
				refresh_tokens rt
			JOIN 
				authentications a
			ON
				rt.authentication_id = a.id
			WHERE
				a.email = $1
			AND
				rt.deletedAt IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsRefreshTokenValidByEmail,
		email,
	).Scan(
		&isRefreshTokenValid,
	)

	if err != nil {
		return false, apperror.ErrInvalidToken(err)
	}

	return isRefreshTokenValid, nil
}

func (r *refreshTokenRepositoryPostgres) GetByEmail(ctx context.Context, email string) (*entity.RefreshToken, error) {
	user := entity.RefreshToken{}

	queryGetByEmail := `
	SELECT 
		rt.token
	FROM
		refresh_tokens rt
	JOIN 
		authentications a
	ON
		rt.authentication_id = a.id
	WHERE
		a.email = $1
	AND
		rt.deletedAt IS NULL
	`

	err := r.db.QueryRowContext(
		ctx,
		queryGetByEmail,
		email,
	).Scan(
		&user.RefreshToken,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrInvalidToken(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &user, nil
}
