package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type PharmacyRepository interface {
	FindPharmacyList(ctx context.Context, params entity.PharmacyFilter) (*entity.PharmacyListPage, error)
}

type pharmacyRepositoryPostgres struct {
	db Querier
}

func NewPharmacyRepositoryPostgres(db *sql.DB) *pharmacyRepositoryPostgres {
	return &pharmacyRepositoryPostgres{
		db: db,
	}
}

func (r *pharmacyRepositoryPostgres) FindPharmacyList(ctx context.Context, params entity.PharmacyFilter) (*entity.PharmacyListPage, error) {
	paramsCount := appconstant.StartingParamsCount
	res := []entity.Pharmacy{}
	var sb strings.Builder
	rowsCount := 0
	var queryDataCount strings.Builder
	var data []interface{}
	sb.WriteString(`
        SELECT 
          p.id, 
					p.name,
					p.address,
					p.city_id,
					p.lat as pharmacy_lat,
					p.lng as pharmacy_lng,
					p.pharmacist_name,
					p.pharmacist_license,
					p.pharmacist_phone,
					p.opening_time,
					(p.opening_time + p.operational_hours) as closing_time,
					p.operational_days,
					p.partner_id,
					c.name
        FROM 
          pharmacies p
				JOIN	
					cities c
				ON
		    	p.city_id = c.id
			`)
	queryParams, paramsData := convertPharmacyQueryParamstoSql(params)
	sb.WriteString(queryParams)
	data = append(data, paramsData...)
	queryDataCount.WriteString(fmt.Sprintf(` SELECT COUNT (*) FROM ( %v )`, sb.String()))
	err := r.db.QueryRowContext(ctx, queryDataCount.String(), data...).Scan(&rowsCount)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	if len(data) > 0 {
		paramsCount = len(data) + 1
	}
	paginationParams, paginationData := convertPaginationParamsToSql(params.Limit, params.Page, paramsCount)
	sb.WriteString(paginationParams)
	data = append(data, paginationData...)
	rows, err := r.db.QueryContext(ctx, sb.String(), data...)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		pharmacy := entity.Pharmacy{}
		err := rows.Scan(
			&pharmacy.Id,
			&pharmacy.Name,
			&pharmacy.Address,
			&pharmacy.City.Id,
			&pharmacy.Latitude,
			&pharmacy.Longitude,
			&pharmacy.PharmacistName,
			&pharmacy.PharmacistLicense,
			&pharmacy.PharmacistPhone,
			&pharmacy.OpeningTime,
			&pharmacy.ClosingTime,
			&pharmacy.OperationalDays,
			&pharmacy.PartnerId,
			&pharmacy.City.Name,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		res = append(res, pharmacy)
	}
	return &entity.PharmacyListPage{
		Pharmacies: res,
		TotalRows:  rowsCount,
	}, nil
}
