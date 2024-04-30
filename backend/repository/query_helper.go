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
		, updated_at = NOW()
	WHERE 
		category_slug = $%d
	RETURNING
		id, name, category_slug, image_url, parent_id, has_child_categories, category_level 
	`, countParams))

	args = append(args, slug)
	countParams++
	return query.String(), args
}

func convertUpdateDoctorQueryParamstoSql(params entity.DoctorUpdateRequest, id int64) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = constant.StartingParamsCount
	if params.Name != nil {
		query.WriteString(fmt.Sprintf("name = $%d ", countParams))
		args = append(args, *params.Name)
		countParams++
	}
	if params.AvatarUrl != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("avatar_url = $%d ", countParams))
		args = append(args, *params.AvatarUrl)
		countParams++
	}
	if params.IsOnline != nil {
		query.WriteString(fmt.Sprintf("is_online = $%d ", countParams))
		args = append(args, *params.IsOnline)
		countParams++
	}
	if params.Experiences != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("experience_years = $%d ", countParams))
		args = append(args, *params.Experiences)
		countParams++
	}

	if params.Fee != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("fee = $%d ", countParams))
		args = append(args, *params.Fee)
		countParams++
	}

	if params.Opening != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("opening_time = $%d ", countParams))
		args = append(args, *params.Opening)
		countParams++
	}
	if params.OperationalHours != nil {
		if *params.OperationalHours != "" {
			if countParams > 1 {
				query.WriteString(",")
			}
			query.WriteString(fmt.Sprintf("operational_hours = $%d ", countParams))
			args = append(args, *params.OperationalHours)
			countParams++
		}
	}
	if params.OperationalDays != nil {
		if *params.OperationalDays != "" {
			if countParams > 1 {
				query.WriteString(",")
			}
			query.WriteString(fmt.Sprintf("operational_days = $%d ", countParams))
			args = append(args, *params.OperationalDays)
			countParams++
		}
	}

	query.WriteString(
		fmt.Sprintf(`
		, updated_at = NOW()
	WHERE 
		id = $%d
	RETURNING
	id, name, avatar_url, is_online, experience_years, certificate_url, 
	fee, opening_time, operational_hours, operational_days
	`, countParams))

	args = append(args, id)
	countParams++
	return query.String(), args
}

func convertProductQueryParamstoSql(params entity.ProductFilter) (string, []interface{}) {
	var query strings.Builder
	var filters []interface{}
	var countParams = constant.StartingParamsCount
	if params.Category != "" || params.Search != "" || params.Classification != nil {
		query.WriteString(" WHERE ")
	}
	if params.Category != "" {
		query.WriteString(fmt.Sprintf(` pc.category_id = $%v`, countParams))
		filters = append(filters, params.Category)
		countParams++
	}

	if params.Search != "" {
		if countParams > constant.StartingParamsCount {
			query.WriteString(` AND `)
		}
		query.WriteString(fmt.Sprintf(` (p.name ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR p.generic_name ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR p.content ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR p.description ILIKE '%%' ||$%v|| '%%' )`, countParams))
		filters = append(filters, params.Search)
		countParams++
	}

	if params.Classification != nil {
		if countParams > constant.StartingParamsCount {
			query.WriteString(` AND `)
		}
		query.WriteString(fmt.Sprintf(` p.classification = $%v `, countParams))
		filters = append(filters, &params.Classification)
		countParams++
	}
	if countParams > constant.StartingParamsCount {
		query.WriteString(` AND `)
	}
	if countParams == constant.StartingParamsCount {
		query.WriteString(` WHERE `)
	}
	query.WriteString(` AND p.deleted_at IS NULL `)

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

func ConvertDoctorQueryParamstoSql(params entity.DoctorFilter) (string, []interface{}) {
	var query strings.Builder
	var filters []interface{}
	var countParams = constant.StartingParamsCount
	if params.Specialization != nil || params.Search != "" || params.OnlineOnly != nil {
		query.WriteString(" WHERE ")
	}

	if params.Search != "" {
		query.WriteString(fmt.Sprintf(` (d.name ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR sp.name ILIKE '%%' ||$%v|| '%%' `, countParams))
		query.WriteString(fmt.Sprintf(` OR sp.description ILIKE '%%' ||$%v|| '%%' ) `, countParams))
		filters = append(filters, params.Search)
		countParams++
	}

	if params.OnlineOnly != nil {
		if *params.OnlineOnly {
			if countParams > 1 {
				query.WriteString(",")
			}
			if countParams > constant.StartingParamsCount {
				query.WriteString(` AND `)
			}
			query.WriteString(fmt.Sprintf(` d.is_online = $%v `, countParams))
			filters = append(filters, params.OnlineOnly)
			countParams++
		}
	}

	if params.Specialization != nil {
		if countParams > constant.StartingParamsCount {
			query.WriteString(` AND `)
		}
		query.WriteString(fmt.Sprintf(` sp.slug = $%v `, countParams))
		filters = append(filters, &params.Specialization)
		countParams++
	}
	if countParams > constant.StartingParamsCount {
		query.WriteString(` AND `)
	}
	if countParams == constant.StartingParamsCount {
		query.WriteString(` WHERE `)
	}
	query.WriteString(` d.deleted_at IS NULL `)

	if params.SortBy != nil {
		if *params.SortBy == constant.SortByName {
			query.WriteString(` ORDER BY d.name `)
		} else if *params.SortBy == constant.SortByPrice {
			query.WriteString(" ORDER BY d.fee ")
		} else if *params.SortBy == constant.SortByExperience {
			query.WriteString(" ORDER BY d.experience_years ")
		}
	}

	if params.Order != nil {
		if params.SortBy == nil {
			query.WriteString(` ORDER BY d.id `)
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

func convertPaginationParamsToSql(limit int, page int, paramsCount int) (string, []interface{}) {
	var query strings.Builder
	var filters []interface{}
	var countParams = paramsCount

	if limit != 0 {
		query.WriteString(fmt.Sprintf(` LIMIT $%v`, countParams))
		filters = append(filters, limit)
		countParams++
	}

	if page != 0 {
		setLimit := 0
		if limit != 0 {
			setLimit = limit
		}
		query.WriteString(fmt.Sprintf(` OFFSET $%v`, countParams))
		filters = append(filters, (page-1)*setLimit)
		countParams++
	}

	return query.String(), filters
}

func convertUpdateUserDetailsToSql(u entity.UpdateUser) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = constant.StartingParamsCount
	if u.Name != nil {
		query.WriteString(fmt.Sprintf("name = $%d ", countParams))
		args = append(args, *u.Name)
		countParams++
	}
	if u.BirthDate != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("birth_date = $%d ", countParams))
		args = append(args, *u.BirthDate)
		countParams++
	}
	if u.Gender != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("gender = $%d ", countParams))
		args = append(args, *u.Gender)
		countParams++
	}
	if u.AvatarUrl != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("avatar_url = $%d ", countParams))
		args = append(args, *u.AvatarUrl)
		countParams++
	}
	if u.ActiveAddressId != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("active_address_id = $%d ", countParams))
		args = append(args, *u.ActiveAddressId)
		countParams++
	}
	query.WriteString(
		fmt.Sprintf(`
		, updated_at = NOW()
		WHERE 
			authentication_id = $%d
		AND
			deleted_at IS NULL
	`, countParams))

	args = append(args, u.AuthenticationId)
	return query.String(), args
}

func convertUpdateAddressToSql(a entity.Address) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = constant.StartingParamsCount
	if a.Alias != nil {
		query.WriteString(fmt.Sprintf("alias = $%d ", countParams))
		args = append(args, *a.Alias)
		countParams++
	}
	if a.City.Id != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("city_id = $%d ", countParams))
		args = append(args, *a.City.Id)
		countParams++
	}
	if a.Detail != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("detail = $%d ", countParams))
		args = append(args, *a.Detail)
		countParams++
	}
	if a.Longitude != nil && a.Latitude != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf(`
				lng = $%d::decimal , lat = $%d::decimal , geom = ST_SetSRID(ST_MakePoint($%d, $%d),4326)
				`,
			countParams,
			countParams+1,
			countParams,
			countParams+1,
		))
		args = append(args, *a.Longitude)
		args = append(args, *a.Latitude)
		countParams += 2
	}
	query.WriteString(
		fmt.Sprintf(`
		, updated_at = NOW()
		WHERE 
			id = $%d
		AND
			user_id = $%d
		AND
			deleted_at IS NULL
	`, countParams, countParams+1))

	args = append(args, a.Id)
	args = append(args, a.UserId)
	return query.String(), args
}
