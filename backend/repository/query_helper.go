package repository

import (
	"fmt"
	"obatin/constant"
	"obatin/entity"
	"strings"
)

func convertProductQueryParamstoSql(params entity.ProductFilter) (string, []interface{}) {
	var query strings.Builder
	var filters []interface{}
	var countParams = constant.StartingParamsCount

	if params.Category != "" {
		query.WriteString(fmt.Sprintf(` WHERE pc.category_id = $%v`, countParams))
		filters = append(filters, params.Category)
		countParams++
	}

	if params.Search != "" {
		query.WriteString(fmt.Sprintf(` AND (p.name ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR p.generic_name ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR p.content ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR p.description ILIKE '%%' ||$%v|| '%%' )`, countParams))
		filters = append(filters, params.Search)
		countParams++
	}

	if params.Classification != nil {
		query.WriteString(fmt.Sprintf(` AND p.classification = $%v `, countParams))
		filters = append(filters, &params.Classification)
		countParams++
	}

	if params.SortBy != nil {
		if *params.SortBy == constant.SortByName {
			query.WriteString(` ORDER BY p.name `)
		} else if *params.SortBy == constant.SortByPrice {
			query.WriteString(" ORDER BY p.min_price  ")
		}
	}

	if params.Order != nil {
		if params.SortBy == nil {
			query.WriteString(` ORDER BY p.id `)
		}
		switch order := *params.Order; order {
		case constant.OrderAscending:
			query.WriteString(`ASC`)
		case constant.OrderDescending:
			query.WriteString(`DESC`)
		}
	}
	return query.String(), filters

}

func convertPaginationParamsToSql(params entity.ProductFilter, paramsCount int) (string, []interface{}) {
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
