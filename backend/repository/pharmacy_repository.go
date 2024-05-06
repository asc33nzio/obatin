package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type PharmacyRepository interface {
	InsertPharmacyProduct(ctx context.Context, pharmacyPrdct *entity.PharmacyProduct) error
	UpdatePharmacyProduct(ctx context.Context, body entity.UpdatePharmacyProduct, id int64) (*entity.PharmacyProduct, error)
	FindPharmacyProductListByPharmacyId(ctx context.Context, pharmacyId int64)
}

type pharmacyRepositoryPostgres struct {
	db Querier
}

func NewPharmacyRepositoryPostgres(db *sql.DB) *pharmacyRepositoryPostgres {
	return &pharmacyRepositoryPostgres{
		db: db,
	}
}

func (r *pharmacyRepositoryPostgres) InsertPharmacyProduct(ctx context.Context, pharmacyPrdct *entity.PharmacyProduct) error {
	queryInsertPharmacyProduct := `
        INSERT INTO
            pharmacy_products(
                product_id, pharmacy_id, price, stock, is_active
			)
        VALUES ($1, $2, $3, $4, $5)
    `

	res, err := r.db.ExecContext(
		ctx,
		queryInsertPharmacyProduct,
		pharmacyPrdct.Product.Id,
		*pharmacyPrdct.Pharmacy.Id,
		*pharmacyPrdct.Price,
		*pharmacyPrdct.Stock,
		pharmacyPrdct.IsActive,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlConfirmPasswordNotMatch)
	}

	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *pharmacyRepositoryPostgres) UpdatePharmacyProduct(ctx context.Context, body entity.UpdatePharmacyProduct, id int64) (*entity.PharmacyProduct, error) {
	pharmacyPrdct := entity.PharmacyProduct{}
	var query strings.Builder
	var data []interface{}

	query.WriteString(`
		UPDATE 
			pharmacy_products 
		SET

	`)

	queryParams, paramsData := convertUpdatePharmacyProductQueryParamstoSql(body, id)
	query.WriteString(queryParams)
	data = append(data, paramsData...)

	err := r.db.QueryRowContext(ctx, query.String(), data...).
		Scan(&pharmacyPrdct.Id, &pharmacyPrdct.Product.Id, &pharmacyPrdct.Pharmacy.Id, &pharmacyPrdct.Price, &pharmacyPrdct.Stock, &pharmacyPrdct.IsActive)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return &pharmacyPrdct, nil

}
