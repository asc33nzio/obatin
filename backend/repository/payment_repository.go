package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type PaymentRepository interface {
	CreateOnePayment(ctx context.Context, p *entity.Payment) (*entity.Payment, error)
}

type paymentRepositoryPostgres struct {
	db Querier
}

func NewPaymentRepositoryPostgres(db *sql.DB) *paymentRepositoryPostgres {
	return &paymentRepositoryPostgres{
		db: db,
	}
}

func (r *paymentRepositoryPostgres) CreateOnePayment(ctx context.Context, p *entity.Payment) (*entity.Payment, error) {
	query := `
		INSERT INTO
			payments(
				user_id,
				payment_method,
				total_payment,
				payment_proof_url
			)
		VALUES
			($1, $2, $3, $4)
		RETURNING
			id
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		*p.User.Id,
		p.PaymentMethod,
		p.TotalPayment,
		p.PaymentProofUrl,
	).Scan(&p.Id)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return p, nil
}
