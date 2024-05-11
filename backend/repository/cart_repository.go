package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type CartRepository interface {
	FindCart(ctx context.Context, userId int64) (*entity.Cart, error)
	CreateOneCartItem(ctx context.Context, c *entity.CartItem) error
	UpdateOneCartItem(ctx context.Context, c *entity.CartItem) error
	IsItemExistInCart(ctx context.Context, c *entity.CartItem) (bool, error)
	FindCartDetails(ctx context.Context, userId int64) (*entity.Cart, error)
	DeleteOneCartItem(ctx context.Context, cartItem *entity.CartItem) error
	FindCartItemsByOrderId(ctx context.Context, orderId int64) ([]*entity.CartItem, error)
}

type cartRepositoryPostgres struct {
	db Querier
}

func NewCartRepositoryPostgres(db *sql.DB) *cartRepositoryPostgres {
	return &cartRepositoryPostgres{
		db: db,
	}
}

func (r *cartRepositoryPostgres) FindCart(ctx context.Context, userId int64) (*entity.Cart, error) {
	c := entity.Cart{}
	c.User.Id = &userId

	query := `
		SELECT
			c.id,
			c.user_id,
			c.order_id,
			c.prescription_id,
			c.pharmacy_product_id,
			c.product_id,
			c.quantity,
			p.name,
			p.max_price,
			p.thumbnail_url,
			p.selling_unit
		FROM
			cart_items c
		JOIN
			products p
		ON
			c.product_id = p.id
		AND
			p.deleted_at IS NULL
		AND
			p.is_active = true
		WHERE
			c.is_active = true
		AND
			c.user_id = $1
		AND
			c.quantity > 0
		AND
			c.deleted_at IS NULL
		ORDER BY
			c.created_at ASC
		
	`

	rows, err := r.db.QueryContext(ctx, query, userId)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		cartItem := entity.CartItem{}
		err := rows.Scan(
			&cartItem.Id,
			&cartItem.UserId,
			&cartItem.OrderId,
			&cartItem.PrescriptionId,
			&cartItem.PharmacyProductId,
			&cartItem.Product.Id,
			&cartItem.Quantity,
			&cartItem.Product.Name,
			&cartItem.Product.MaxPrice,
			&cartItem.Product.ThumbnailUrl,
			&cartItem.Product.SellingUnit,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		c.Items = append(c.Items, &cartItem)
	}

	return &c, nil
}

func (r *cartRepositoryPostgres) CreateOneCartItem(ctx context.Context, c *entity.CartItem) error {
	var prescriptionId interface{}
	var pharmacyId interface{}
	query := `
		INSERT INTO
			cart_items(
				user_id,
				product_id,
				prescription_id,
				pharmacy_id,
				quantity)
		VALUES 
			($1, $2, $3, $4, $5)
	`

	if c.PrescriptionId == nil {
		prescriptionId = nil
	} else {
		prescriptionId = *c.PrescriptionId
	}

	if c.Pharmacy.Id == nil {
		pharmacyId = nil
	} else {
		pharmacyId = *c.Pharmacy.Id
	}

	res, err := r.db.ExecContext(
		ctx,
		query,
		*c.UserId,
		c.Product.Id,
		prescriptionId,
		pharmacyId,
		*c.Quantity,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *cartRepositoryPostgres) UpdateOneCartItem(ctx context.Context, c *entity.CartItem) error {
	query, args := updateOneCartItemQuery(c)

	res, err := r.db.ExecContext(
		ctx,
		query,
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
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *cartRepositoryPostgres) IsItemExistInCart(ctx context.Context, c *entity.CartItem) (bool, error) {
	var isExist bool
	query := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				cart_items 
			WHERE 
				user_id = $1
			AND
				product_id = $2
			AND
				is_active = true
			AND 
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		*c.UserId,
		c.Product.Id,
	).Scan(
		&isExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isExist, nil
}

func (r *cartRepositoryPostgres) FindCartDetails(ctx context.Context, userId int64) (*entity.Cart, error) {
	res := entity.Cart{}
	query := `
		SELECT DISTINCT ON (c.id)
			c.id,
			c.product_id,
			c.user_id,
			c.order_id,
			c.prescription_id,
			c.quantity,
			p.name as product_name,
			p.thumbnail_url as product_thumbnail_url,
			p.selling_unit as product_selling_unit,
			p.weight,
			p.is_prescription_required,
			np.pharmacy_id as pharmacy_id,
			np.distance as pharmacy_distance,
			np.name as pharmacy_name,
			np.address as pharmacy_address,
			np.city_id as pharmacy_city_id,
			np.lat as pharmacy_lat,
			np.lng as pharmacy_lng,
			np.pharmacist_name,
			np.pharmacist_license,
			np.pharmacist_phone,
			np.opening_time,
			np.closing_time,
			np.operational_days,
			np.partner_id,
			pp.id as pharmacy_product_id,
			pp.price,
			pp.stock
		FROM
			cart_items c
		JOIN
			products p 
		ON 
			c.product_id = p.id
		LEFT JOIN
			pharmacies_products pp 
		ON 
			c.product_id = pp.product_id
		AND
			pp.is_active = true
		LEFT JOIN (
			WITH user_geom AS (
				SELECT a.geom 
				FROM users u 
				JOIN addresses a ON u.active_address_id = a.id
				WHERE u.id = $1
				AND u.deleted_at IS NULL
			)
			SELECT 
				ST_distancesphere(ug.geom, p.geom)::smallint AS distance,
				p.id as pharmacy_id,
				p.partner_id as partner_id,
				p.name,
				p.address,
				p.city_id,
				p.lat,
				p.lng,
				p.pharmacist_name,
				p.pharmacist_license,
				p.pharmacist_phone,
        p.opening_time,
        (p.opening_time + p.operational_hours) as closing_time,
				p.operational_days
			FROM
				pharmacies p
			JOIN
				user_geom ug ON ST_distancesphere(ug.geom, p.geom) <= 25000
			ORDER BY 
				ST_distancesphere(ug.geom, p.geom) ASC
			) as np 
		ON 
			CASE
				WHEN c.pharmacy_id IS NOT NULL 
				THEN c.pharmacy_id = np.pharmacy_id AND pp.pharmacy_id = np.pharmacy_id
				ELSE pp.pharmacy_id = np.pharmacy_id
			END
		WHERE
			c.is_active = true
		AND
			c.user_id = $1
		AND
			c.deleted_at IS NULL
		AND
			p.deleted_at IS NULL
		AND
			p.is_active = true
		ORDER BY
			c.id, np.distance ASC;
	`

	rows, err := r.db.QueryContext(ctx, query, userId)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		cartItem := entity.CartItem{}
		err := rows.Scan(
			&cartItem.Id,
			&cartItem.Product.Id,
			&cartItem.UserId,
			&cartItem.OrderId,
			&cartItem.PrescriptionId,
			&cartItem.Quantity,
			&cartItem.Product.Name,
			&cartItem.Product.ThumbnailUrl,
			&cartItem.Product.SellingUnit,
			&cartItem.Product.Weight,
			&cartItem.Product.IsPrescriptionRequired,
			&cartItem.Pharmacy.Id,
			&cartItem.Pharmacy.Distance,
			&cartItem.Pharmacy.Name,
			&cartItem.Pharmacy.Address,
			&cartItem.Pharmacy.City.Id,
			&cartItem.Pharmacy.Latitude,
			&cartItem.Pharmacy.Longitude,
			&cartItem.Pharmacy.PharmacistName,
			&cartItem.Pharmacy.PharmacistLicense,
			&cartItem.Pharmacy.PharmacistPhone,
			&cartItem.Pharmacy.OpeningTime,
			&cartItem.Pharmacy.ClosingTime,
			&cartItem.Pharmacy.OperationalDays,
			&cartItem.Pharmacy.PartnerId,
			&cartItem.PharmacyProductId,
			&cartItem.PharmacyProduct.Price,
			&cartItem.PharmacyProduct.Stock,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		res.Items = append(res.Items, &cartItem)
	}

	return &res, nil
}

func (r *cartRepositoryPostgres) DeleteOneCartItem(ctx context.Context, cartItem *entity.CartItem) error {
	query := `
		UPDATE
			cart_items
		SET
			deleted_at = NOW() , updated_at = NOW()
		WHERE
			id = $1
		AND
			user_id = $2
		AND
			product_id = $3
		AND
			deleted_at IS NULL
	`

	res, err := r.db.ExecContext(
		ctx,
		query,
		*cartItem.Id,
		*cartItem.UserId,
		cartItem.Product.Id,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.NewProductNotFound(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *cartRepositoryPostgres) FindCartItemsByOrderId(ctx context.Context, orderId int64) ([]*entity.CartItem, error) {
	res := []*entity.CartItem{}

	query := `
		SELECT
			ci.id,
			ci.order_id,
			ci.pharmacy_product_id,
			ci.quantity
		FROM
			cart_items ci
		WHERE
			ci.order_id = $1
		AND
			ci.deleted_at IS NULL
	`

	rows, err := r.db.QueryContext(ctx, query, orderId)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		cartItem := entity.CartItem{}
		err := rows.Scan(
			&cartItem.Id,
			&cartItem.OrderId,
			&cartItem.PharmacyProductId,
			&cartItem.Quantity,
		)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		res = append(res, &cartItem)
	}

	return res, nil
}
