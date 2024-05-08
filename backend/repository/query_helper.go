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

func convertUpdateProductQueryParamstoSql(params entity.UpdateProduct, productId int64) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = constant.StartingParamsCount
	if params.Name != nil {
		query.WriteString(fmt.Sprintf("name = $%d ", countParams))
		args = append(args, *params.Name)
		countParams++
	}
	if params.Manufacturer != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("manufacturer_id = $%d ", countParams))
		args = append(args, params.Manufacturer.ID)
		countParams++
	}
	if params.IsPrescriptionRequired != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("is_prescription_required = $%d ", countParams))
		args = append(args, *params.IsPrescriptionRequired)
		countParams++
	}
	if params.IsActive != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("is_active = $%d ", countParams))
		args = append(args, *params.IsActive)
		countParams++
	}
	if params.Width != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("width = $%d ", countParams))
		args = append(args, *params.Width)
		countParams++
	}
	if params.Height != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("height = $%d ", countParams))
		args = append(args, *params.Height)
		countParams++
	}
	if params.Length != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("length = $%d ", countParams))
		args = append(args, *params.Length)
		countParams++
	}
	if params.Weight != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("weight = $%d ", countParams))
		args = append(args, *params.Weight)
		countParams++
	}
	if params.SellingUnit != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("selling_unit = $%d ", countParams))
		args = append(args, *params.SellingUnit)
		countParams++
	}
	if params.Packaging != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("packaging = $%d ", countParams))
		args = append(args, *params.Packaging)
		countParams++
	}
	if params.Classification != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("classification = $%d ", countParams))
		args = append(args, *params.Classification)
		countParams++
	}
	if params.Description != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("description = $%d ", countParams))
		args = append(args, *params.Description)
		countParams++
	}
	if params.Content != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("content = $%d ", countParams))
		args = append(args, *params.Content)
		countParams++
	}
	if params.BpomNumber != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("bpom_number = $%d ", countParams))
		args = append(args, *params.BpomNumber)
		countParams++
	}
	if params.Warning != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("warning = $%d ", countParams))
		args = append(args, *params.Warning)
		countParams++
	}
	if params.Contraindication != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("contraindication = $%d ", countParams))
		args = append(args, *params.Contraindication)
		countParams++
	}
	if params.SideEffects != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("side_effects = $%d ", countParams))
		args = append(args, *params.SideEffects)
		countParams++
	}
	if params.HowToUse != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("how_to_use = $%d ", countParams))
		args = append(args, *params.HowToUse)
		countParams++
	}
	if params.Dosage != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("dosage = $%d ", countParams))
		args = append(args, *params.Dosage)
		countParams++
	}
	if params.GeneralIndication != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("general_indication = $%d ", countParams))
		args = append(args, *params.GeneralIndication)
		countParams++
	}
	if params.GenericName != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("generic_name = $%d ", countParams))
		args = append(args, *params.GenericName)
		countParams++
	}
	if params.MinPrice != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("min_price = $%d ", countParams))
		args = append(args, *params.MinPrice)
		countParams++
	}
	if params.MaxPrice != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("max_price = $%d ", countParams))
		args = append(args, *params.MaxPrice)
		countParams++
	}
	if params.Slug != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("product_slug = $%d ", countParams))
		args = append(args, *params.Slug)
		countParams++
	}
	if params.ImageUrl != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("image_url = $%d ", countParams))
		countParams++
		query.WriteString(fmt.Sprintf(", thumbnail_url = $%d ", countParams))
		args = append(args, *params.ImageUrl)
		args = append(args, *params.ImageUrl)
		countParams++
	}

	query.WriteString(
		fmt.Sprintf(`
		, updated_at = NOW()
	WHERE 
		id = $%d
	`, countParams))

	args = append(args, productId)
	countParams++
	return query.String(), args
}

func convertUpdatePharmacyProductQueryParamstoSql(params entity.UpdatePharmacyProduct, id int64) (string, []interface{}) {
	var query strings.Builder
	var args []interface{}
	var countParams = constant.StartingParamsCount

	if params.Price != nil {
		query.WriteString(fmt.Sprintf("price = $%d ", countParams))
		args = append(args, *params.Price)
		countParams++
	}

	if params.IsActive != nil {
		if countParams > 1 {
			query.WriteString(",")
		}
		query.WriteString(fmt.Sprintf("is_active = $%d ", countParams))
		args = append(args, *params.Price)
		countParams++
	}

	query.WriteString(
		fmt.Sprintf(`
		, updated_at = NOW()
	WHERE 
		id = $%d
	RETURNING
		id, product_id, pharmacy_id, price, stock, is_active 
	`, countParams))

	args = append(args, id)
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
		authentication_id = $%d
	RETURNING
		id,
		name,
		avatar_url,
		is_online,
		experience_years,
		certificate_url,
		fee,
		opening_time,
		operational_hours,
		operational_days
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
		query.WriteString(fmt.Sprintf(` pc.category_id = $%v AND pc.deleted_at IS NULL`, countParams))
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
	query.WriteString(` p.deleted_at IS NULL `)

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

func convertDoctorQueryParamstoSql(params entity.DoctorFilter) (string, []interface{}) {
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

func prescriptionItemsBulkInsertQuery(cp *entity.CreatePrescription) (string, []interface{}) {
	var sb strings.Builder
	var args []interface{}
	var counter int
	sb.WriteString(
		`INSERT INTO
			prescription_items(prescription_id,product_id,amount)
		VALUES`,
	)

	for _, pItem := range cp.Items {
		if counter > 0 {
			sb.WriteString(" , ")
		}

		input := fmt.Sprintf("($%d, $%d, $%d)", len(args)+1, len(args)+2, len(args)+3)
		args = append(args, cp.Id)
		args = append(args, pItem.Product.Id)
		args = append(args, pItem.Amount)
		sb.WriteString(input)
		counter += 1
	}

	return sb.String(), args
}

func updateOneCartItemQuery(c *entity.CartItem) (string, []interface{}) {
	var args []interface{}
	var pharmacyId interface{}
	var pharmacyProductId interface{}
	var orderId interface{}
	var isActive interface{}

	query := `
		UPDATE
			cart_items
		SET
			quantity = $1 , 
			pharmacy_id = $2,
			pharmacy_product_id = $3,
			order_id = $4,
			is_active = $5, 
			updated_at = NOW()
		WHERE 
			user_id = $6
		AND
			product_id = $7
		AND
			is_active = true
		AND 
			deleted_at IS NULL
	`

	if c.Pharmacy.Id == nil {
		pharmacyId = nil
	} else {
		pharmacyId = *c.Pharmacy.Id
	}

	if c.PharmacyProductId == nil {
		pharmacyProductId = nil
	} else {
		pharmacyProductId = *c.PharmacyProductId
	}

	if c.OrderId == nil {
		orderId = nil
	} else {
		orderId = *c.OrderId
	}

	if c.IsActive == nil {
		isActive = true
	} else {
		isActive = *c.IsActive
	}

	args = append(args, *c.Quantity)
	args = append(args, pharmacyId)
	args = append(args, pharmacyProductId)
	args = append(args, orderId)
	args = append(args, isActive)
	args = append(args, *c.UserId)
	args = append(args, c.Product.Id)

	return query, args
}

func userOrdersQuery(userId int64, params *entity.UserOrdersFilter) (string, []interface{}) {
	var query strings.Builder
	var queryConditionalPart strings.Builder
	var subqueryOrder strings.Builder
	var subqueryRowsCount strings.Builder
	var args []interface{}

	queryConditionalPart.WriteString(`
		WHERE
			o.user_id = $1
		AND
			o.deleted_at IS NULL
	`)
	args = append(args, userId)

	if params.Status != nil {
		queryConditionalPart.WriteString(" AND o.status = $2 ")
		args = append(args, *params.Status)
	}

	subqueryRowsCount.WriteString(fmt.Sprintf(`
		CROSS JOIN (
			SELECT
				COUNT(*) as total_rows
			FROM
				orders o
			%v
		) AS tr
`, queryConditionalPart.String()))

	paginationParams, paginationData := convertPaginationParamsToSql(params.Limit, params.Page, len(args)+1)
	args = append(args, paginationData...)
	subqueryOrder.WriteString(fmt.Sprintf(` 
		WITH 
			order_details AS ( 
				SELECT 
					o.id,
					o.user_id,
					o.shipping_id,
					o.pharmacy_id,
					o.status,
					o.number_items,
					o.shipping_cost,
					o.subtotal,
					o.payment_id,
					TO_CHAR(o.created_at, 'DD-MM-YYYY HH24:MI') as created_at		
				FROM
					orders o
					%v
				ORDER BY o.created_at DESC , o.id ASC
				%v
			)
	`,
		queryConditionalPart.String(), paginationParams))

	query.WriteString(subqueryOrder.String())
	query.WriteString(`
		SELECT
			tr.total_rows,
			od.id,
			od.user_id,
			od.shipping_id,
			od.pharmacy_id,
			od.status,
			od.number_items,
			od.shipping_cost,
			od.subtotal,
			od.payment_id,
			od.created_at,
			sm.code,
			sm.name,
			sm.type,
			p.name as pharmacy_name,
			p.address as pharmacy_address,
			p.city_id as pharmacy_city_id,
			p.lat as pharmacy_lat,
			p.lng as pharmacy_lng,
			p.pharmacist_name,
			p.pharmacist_license,
			p.pharmacist_phone,
			p.opening_time,
			(p.opening_time + p.operational_hours) as closing_time,
			p.operational_days,
			p.partner_id,
			pd.name,
			pd.thumbnail_url,
			pd.selling_unit,
			pd.is_prescription_required,
			pd.weight,
			pd.product_slug,
			ci.id,
			ci.prescription_id,
			ci.quantity,
			ci.order_id,
			ci.product_id,
			ci.pharmacy_product_id,
			pp.price
		FROM
			order_details od 
		JOIN
			shippings s
		ON
			od.shipping_id = s.id
		JOIN
			shipping_methods sm
		ON
			s.shipping_method_id = sm.id
		JOIN
			pharmacies p
		ON
			od.pharmacy_id = p.id
		JOIN
			cart_items ci
		ON
			ci.order_id = od.id
		AND
			ci.is_active = false
		JOIN
			products pd
		ON
			ci.product_id = pd.id
		JOIN
			pharmacies_products pp
		ON
			ci.pharmacy_product_id = pp.id
	`)
	query.WriteString(subqueryRowsCount.String())

	return query.String(), args
}
