package repository

import (
	"fmt"
	"obatin/constant"
	"obatin/entity"
	"strings"
)

func convertUpdateCategoryQueryParamstoSql(params entity.CategoryUpdateBody, slug string) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = constant.StartingParamsCount
	if params.Name != nil {
		query.WriteString(fmt.Sprintf("name = $%d ", countParams))
		args = append(args, *params.Name)
		countParams++
	}
	if params.Slug != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("category_slug = $%d ", countParams))
		args = append(args, *params.Slug)
		countParams++
	}
	if params.ImageUrl != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("image_url = $%d ", countParams))
		args = append(args, *params.ImageUrl)
		countParams++
	}
	if params.ParentId != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("parent_id = $%d ", countParams))
		args = append(args, *params.ParentId)
		countParams++
	}
	if params.HasChild != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("has_child_categories = $%d ", countParams))
		args = append(args, *params.HasChild)
		countParams++
	}
	if params.Level != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("category_level = $%d ", countParams))
		args = append(args, *params.Level)
		countParams++
	}
	query.WriteString(
		fmt.Sprintf(`
		, updatedat = NOW()
	WHERE 
		category_slug = $%d
	RETURNING
		id, name, category_slug, image_url, parent_id, has_child_categories, category_level 
	`, countParams))

	args = append(args, slug)
	countParams++
	return query.String(), args
}

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
