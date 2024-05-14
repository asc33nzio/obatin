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

type ManufacturerRepository interface {
	GetAllManufacturer(ctx context.Context, params entity.ManufacturerFilter) (*entity.ManufacturerListPage, error)
}

type manufacturerRepositoryPostgres struct {
	db Querier
}

func ManufacturerRepositoryPostgres(db *sql.DB) *manufacturerRepositoryPostgres {
	return &manufacturerRepositoryPostgres{
		db: db,
	}
}

func (r *manufacturerRepositoryPostgres) GetAllManufacturer(ctx context.Context, params entity.ManufacturerFilter) (*entity.ManufacturerListPage, error) {
	paramsCount := appconstant.StartingParamsCount
	res := []entity.Manufacturer{}
	var sb strings.Builder
	rowsCount := 0
	var queryDataCount strings.Builder
	var data []interface{}

	sb.WriteString(`
        SELECT DISTINCT 
            id, name
        FROM 
            manufacturers `)
	queryParams, paramsData := convertManufacturerQueryParamstoSql(params)
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
		manufacturer := entity.Manufacturer{}
		err := rows.Scan(&manufacturer.ID, &manufacturer.Name)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		res = append(res, manufacturer)
	}
	return &entity.ManufacturerListPage{
		Manufacturers: res,
		TotalRows:     rowsCount,
	}, nil
}
