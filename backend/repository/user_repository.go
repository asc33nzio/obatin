package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type UserRepository interface {
	CreateNewUser(ctx context.Context, authentiactionId int64) error
	FindAuthByUserId(ctx context.Context, userId int64) (*entity.User, error)
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
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *userRepositoryPostgres) FindAuthByUserId(ctx context.Context, userId int64) (*entity.User, error) {
	user := entity.User{}

	queryFindUser := `
	SELECT 
		(id,
		authentication_id)
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
		&user.AuthenticationID,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrEmailNotRegistered(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &user, nil
}
