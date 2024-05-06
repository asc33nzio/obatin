package dto

import (
	"obatin/entity"

	"github.com/shopspring/decimal"
)

type UpdateCartReq struct {
	Cart []UpdateOneCartItemReq `json:"cart" binding:"required,dive,required"`
}

type UpdateOneCartItemReq struct {
	ProductId      *int64 `json:"product_id" binding:"required,gte=1"`
	Quantity       *int   `json:"quantity" binding:"required,gte=0"`
	PrescriptionId *int64 `json:"prescription_id"`
}

type DeleteOneCartItemReq struct {
	Id        *int64 `json:"id" binding:"required,gte=1"`
	ProductId *int64 `json:"product_id" binding:"required,gte=1"`
}

type GetCartRes struct {
	UserId   *int64        `json:"user_id"`
	Subtotal *int          `json:"subtotal"`
	Cart     []CartItemRes `json:"cart"`
}

type CartItemRes struct {
	Id                     *int64          `json:"id"`
	ProductId              *int64          `json:"product_id"`
	Name                   *string         `json:"name"`
	Quantity               *int            `json:"quantity"`
	PrescriptionId         *int64          `json:"prescription_id"`
	PharmacyProductId      *int64          `json:"pharmacy_product_id"`
	ThumbnailUrl           *string         `json:"thumbnail_url"`
	SellingUnit            *string         `json:"selling_unit"`
	OrderId                *int64          `json:"order_id"`
	Price                  *int            `json:"price"`
	Stock                  *int            `json:"stock"`
	IsPrescriptionRequired bool            `json:"is_prescription_required"`
	Pharmacy               CartPharmacyRes `json:"pharmacy"`
}

type CartPharmacyProductRes struct {
	Id         int64           `json:"id"`
	Price      *int            `json:"price"`
	Stock      *int            `json:"stock"`
	TotalStock int             `json:"total_stock"`
	Pharmacy   CartPharmacyRes `json:"pharmacy"`
}

type CartPharmacyRes struct {
	Id                *int64           `json:"id"`
	Name              *string          `json:"name"`
	Address           *string          `json:"address"`
	CityId            *int64           `json:"city_id"`
	Latitude          *decimal.Decimal `json:"lat"`
	Longitude         *decimal.Decimal `json:"lng"`
	PharmacistName    *string          `json:"pharmacist_name"`
	PharmacistLicense *string          `json:"pharmacist_license"`
	PharmacistPhone   *string          `json:"pharmacist_phone"`
	PartnerId         *int64           `json:"partner_id"`
	Distance          *int             `json:"distance"`
}

type CartShippingMethodRes struct {
	Id    int64  `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
	Type  string `json:"type"`
}

func (c UpdateCartReq) ToCart(authentiactionId *int64) entity.Cart {
	cart := entity.Cart{}
	cart.User.Authentication.Id = *authentiactionId

	for _, item := range c.Cart {
		cart.Items = append(cart.Items, &entity.CartItem{
			Product:        entity.ProductDetail{Id: *item.ProductId},
			PrescriptionId: item.PrescriptionId,
			Quantity:       item.Quantity,
		})
	}

	return cart
}

func (c UpdateOneCartItemReq) ToCartItem(authentiactionId *int64) *entity.CartItem {
	return &entity.CartItem{
		AuthenticationId: *authentiactionId,
		Quantity:         c.Quantity,
		Product:          entity.ProductDetail{Id: *c.ProductId},
	}
}

func (c DeleteOneCartItemReq) ToCartItem(authentiactionId *int64) *entity.CartItem {
	return &entity.CartItem{
		AuthenticationId: *authentiactionId,
		Id:               c.Id,
		Product:          entity.ProductDetail{Id: *c.ProductId},
	}
}

func ToGetCartRes(c *entity.Cart) GetCartRes {
	res := GetCartRes{}
	res.UserId = c.User.Id
	res.Subtotal = &c.Subtotal

	for _, item := range c.Items {
		res.Cart = append(res.Cart, CartItemRes{
			Id:                     item.Id,
			ProductId:              &item.Product.Id,
			Name:                   &item.Product.Name,
			Quantity:               item.Quantity,
			PrescriptionId:         item.PrescriptionId,
			PharmacyProductId:      item.PharmacyProductId,
			ThumbnailUrl:           &item.Product.ThumbnailUrl,
			SellingUnit:            &item.Product.SellingUnit,
			OrderId:                item.OrderId,
			Stock:                  item.PharmacyProduct.Stock,
			IsPrescriptionRequired: item.Product.IsPrescriptionRequired,
			Price:                  item.PharmacyProduct.Price,
			Pharmacy: CartPharmacyRes{
				Id:                item.Pharmacy.Id,
				Name:              item.Pharmacy.Name,
				Address:           item.Pharmacy.Address,
				CityId:            item.Pharmacy.City.Id,
				Latitude:          item.Pharmacy.Latitude,
				Longitude:         item.Pharmacy.Longitude,
				PharmacistName:    item.Pharmacy.PharmacistName,
				PharmacistLicense: item.Pharmacy.PharmacistLicense,
				PharmacistPhone:   item.Pharmacy.PharmacistPhone,
				PartnerId:         item.Pharmacy.PartnerId,
				Distance:          item.Pharmacy.Distance,
			},
		})
	}

	return res
}
