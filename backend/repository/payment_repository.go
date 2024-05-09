package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type PaymentRepository interface {
	CreateOnePayment(ctx context.Context, p *entity.Payment) (*entity.Payment, error)
	UpdateOnePayment(ctx context.Context, p *entity.Payment) error
	FindAllPendingPayments(ctx context.Context) ([]*entity.Payment, error)
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

func (r *paymentRepositoryPostgres) UpdateOnePayment(ctx context.Context, p *entity.Payment) error {
	var query strings.Builder
	var args []interface{}

	query.WriteString(`
		UPDATE
			payments
		SET
			updated_at = NOW()
	`)

	if p.PaymentProofUrl != nil {
		query.WriteString(fmt.Sprintf(" , payment_proof_url = $%d ", len(args)+1))
		args = append(args, *p.PaymentProofUrl)
	}

	if p.IsConfirmed != nil {
		query.WriteString(fmt.Sprintf(" , is_confirmed = $%d ", len(args)+1))
		args = append(args, *p.IsConfirmed)
	}

	query.WriteString(fmt.Sprintf(`
		WHERE
			id = $%d
		AND
			user_id = $%d
		AND
			deleted_at IS NULL
	`, len(args)+1, len(args)+2))

	args = append(args, p.Id)
	args = append(args, *p.User.Id)

	res, err := r.db.ExecContext(
		ctx,
		query.String(),
		args...,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.ErrPaymentNotFound(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *paymentRepositoryPostgres) FindAllPendingPayments(ctx context.Context) ([]*entity.Payment, error) {
	res := []*entity.Payment{}
	query := `
		SELECT
			p.id,
			p.invoice_number,
			p.user_id,
			p.payment_method,
			p.total_payment,
			p.payment_proof_url,
			p.is_confirmed,
			TO_CHAR(p.created_at, 'DD-MM-YYYY HH24:MI')
		FROM
			payments p
		JOIN
			users u
		ON
			p.user_id = u.id
		WHERE
			p.is_confirmed = true
		AND
			p.deleted_at IS NULL
	`

	rows, err := r.db.QueryContext(
		ctx,
		query,
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		p := entity.Payment{}
		err = rows.Scan(
			&p.Id,
			&p.InvoiceNumber,
			&p.User.Id,
			&p.PaymentMethod,
			&p.TotalPayment,
			&p.PaymentProofUrl,
			&p.IsConfirmed,
			&p.ExpiredAt,
			&p.CreatedAt,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		res = append(res, &p)
	}

	return res, nil
}
