package repository

import (
	"fmt"
	"obatin/appconstant"
	"obatin/entity"
	"strings"
)

func convertPartnerQueryParamstoSql(params entity.PartnerFilter) (string, []interface{}) {
	var query strings.Builder
	var filters []interface{}
	var countParams = appconstant.StartingParamsCount
	if params.Search != "" {
		query.WriteString(fmt.Sprintf(` AND p.name ILIKE '%%' ||$%v|| '%%' `, countParams))
		filters = append(filters, params.Search)
		countParams++
	}

	return query.String(), filters

}

func convertPaginationPartnerParamsToSql(params entity.PartnerFilter, paramsCount int) (string, []interface{}) {
	var query strings.Builder
	var filters []interface{}
	var countParams = paramsCount

	if params.Limit != 0 {
		query.WriteString(fmt.Sprintf(` LIMIT $%v`, countParams))
		filters = append(filters, params.Limit)
		countParams++
	}

	if params.Page != 0 {
		setLimit := 0
		if params.Limit != 0 {
			setLimit = params.Limit
		}
		query.WriteString(fmt.Sprintf(` OFFSET $%v`, countParams))
		filters = append(filters, (params.Page-1)*setLimit)
		countParams++
	}

	return query.String(), filters
}

func convertUpdatePartnerQueryParamstoSql(params entity.PartnerUpdateRequest, id int64) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = appconstant.StartingParamsCount
	if params.Name != nil {
		query.WriteString(fmt.Sprintf("name = $%d ", countParams))
		args = append(args, *params.Name)
		countParams++
	}
	if params.LogoURL != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("logo_url = $%d ", countParams))
		args = append(args, *params.LogoURL)
		countParams++
	}
	query.WriteString(
		fmt.Sprintf(`
		, updated_at = NOW()
	WHERE 
		id = $%d
	RETURNING
		id,name,logo_url
	`, countParams))

	args = append(args, id)
	countParams++
	return query.String(), args
}

func convertUpdateAuthenticationPartnerQueryParamstoSql(params entity.PartnerUpdateRequest, id int64) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = appconstant.StartingParamsCount
	if params.Email != nil {
		query.WriteString(fmt.Sprintf("email = $%d ", countParams))
		args = append(args, *params.Email)
		countParams++
	}
	if params.Password != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("password = $%d ", countParams))
		args = append(args, *params.Password)
		countParams++
	}
	query.WriteString(
		fmt.Sprintf(`
		, updated_at = NOW()
	WHERE 
		id = $%d
	RETURNING
		id,email
	`, countParams))

	args = append(args, id)
	countParams++
	return query.String(), args
}
