package dto

import (
	"obatin/entity"
	"strings"

	"github.com/shopspring/decimal"
)

type UpdateCartReq struct {
	Cart []UpdateOneCartItemReq `json:"cart" binding:"required,dive,required"`
}

type UpdateOneCartItemReq struct {
	ProductId      *int64 `json:"product_id" binding:"required,gte=1"`
	Quantity       *int   `json:"quantity" binding:"required,gte=0"`
	PrescriptionId *int64 `json:"prescription_id"`
	PharmacyId     *int64 `json:"pharmacy_id"`
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

type GetCartDetailsRes struct {
	UserId         *int64            `json:"user_id"`
	Subtotal       *int              `json:"subtotal"`
	PharmaciesCart []CartPharmacyRes `json:"pharmacies_cart"`
}

type CartItemRes struct {
	Id                     *int64  `json:"id"`
	ProductId              *int64  `json:"product_id"`
	Name                   *string `json:"name"`
	Quantity               *int    `json:"quantity"`
	PrescriptionId         *int64  `json:"prescription_id"`
	PharmacyProductId      *int64  `json:"pharmacy_product_id"`
	ThumbnailUrl           *string `json:"thumbnail_url"`
	SellingUnit            *string `json:"selling_unit"`
	OrderId                *int64  `json:"order_id"`
	Price                  *int    `json:"price"`
	MaxPrice               *int    `json:"max_price,omitempty"`
	Stock                  *int    `json:"stock"`
	Slug                   string  `json:"slug"`
	Weight                 int64   `json:"weight"`
	IsPrescriptionRequired bool    `json:"is_prescription_required"`
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
	OpeningTime       *string          `json:"opening_time"`
	ClosingTime       *string          `json:"closing_time"`
	OperationalDays   []string         `json:"operational_days"`
	PartnerId         *int64           `json:"partner_id"`
	Distance          *int             `json:"distance"`
	TotalWeight       int64            `json:"total_weight"`
	SubtotalPharmacy  int              `json:"subtotal_pharmacy"`
	Items             []*CartItemRes   `json:"cart_items"`
}

type CartCheckoutReq struct {
	PharmaciesCart []*CartCheckoutPharmacyReq `json:"pharmacies_cart" binding:"required,dive,required"`
}

type CartCheckoutPharmacyReq struct {
	Id           int64                  `json:"id" binding:"required,gte=1"`
	PartnerId    int64                  `json:"partner_id" binding:"required,gte=1"`
	Distance     int                    `json:"distance" binding:"required,gte=0"`
	ShippingId   int64                  `json:"shipping_id" binding:"required,gte=1"`
	ShippingCost int                    `json:"shipping_cost" binding:"required,gte=0"`
	Subtotal     int                    `json:"subtotal_pharmacy" binding:"required,gte=0"`
	CartItems    []*CartCheckoutItemReq `json:"cart_items" binding:"required,dive,required"`
}

type CartCheckoutItemReq struct {
	Id                *int64 `json:"id" binding:"required"`
	ProductId         *int64 `json:"product_id" binding:"required"`
	Quantity          *int   `json:"quantity" binding:"required"`
	PrescriptionId    *int64 `json:"prescription_id"`
	PharmacyProductId *int64 `json:"pharmacy_product_id" binding:"required"`
	OrderId           *int64 `json:"order_id"`
	Name              string `json:"name" binding:"required"`
}

type CartCheckoutRes struct {
	PaymentId int64 `json:"payment_id"`
}

func (c UpdateCartReq) ToCart(authentiactionId *int64) entity.Cart {
	cart := entity.Cart{}
	cart.User.Authentication.Id = *authentiactionId

	for _, item := range c.Cart {
		cart.Items = append(cart.Items, &entity.CartItem{
			Product:        entity.ProductDetail{Id: *item.ProductId},
			PrescriptionId: item.PrescriptionId,
			Quantity:       item.Quantity,
			Pharmacy:       entity.Pharmacy{Id: item.PharmacyId},
		})
	}

	return cart
}

func (c UpdateOneCartItemReq) ToCartItem(authentiactionId *int64) *entity.CartItem {
	return &entity.CartItem{
		AuthenticationId: *authentiactionId,
		Quantity:         c.Quantity,
		Product:          entity.ProductDetail{Id: *c.ProductId},
		Pharmacy:         entity.Pharmacy{Id: c.PharmacyId},
	}
}

func (c DeleteOneCartItemReq) ToCartItem(authentiactionId *int64) *entity.CartItem {
	return &entity.CartItem{
		AuthenticationId: *authentiactionId,
		Id:               c.Id,
		Product:          entity.ProductDetail{Id: *c.ProductId},
	}
}

func (c CartCheckoutReq) ToCartCheckout(authenticationId int64) *entity.CartCheckout {
	res := entity.CartCheckout{}
	var totalPayment int
	res.User.Authentication.Id = authenticationId

	for _, pc := range c.PharmaciesCart {
		totalPayment += pc.Subtotal + pc.ShippingCost
		cartItems := []*entity.CartItem{}
		for _, ci := range pc.CartItems {
			cartItems = append(cartItems, &entity.CartItem{
				Id:                ci.Id,
				Product:           entity.ProductDetail{Id: *ci.ProductId, Name: ci.Name},
				Quantity:          ci.Quantity,
				PrescriptionId:    ci.PrescriptionId,
				PharmacyProductId: ci.PharmacyProductId,
				OrderId:           ci.OrderId,
			})
		}

		res.PharmaciesCart = append(res.PharmaciesCart, entity.Order{
			Pharmacy: entity.Pharmacy{
				Id:        &pc.Id,
				PartnerId: &pc.PartnerId,
				Distance:  &pc.Distance,
			},
			Shipping: entity.Shipping{
				Id: pc.ShippingId,
			},
			ShippingCost: pc.ShippingCost,
			Subtotal:     pc.Subtotal,
			CartItems:    cartItems,
		})
	}

	res.Payment.TotalPayment = totalPayment
	return &res
}

func ToGetCartRes(c *entity.Cart) GetCartRes {
	res := GetCartRes{}
	res.UserId = c.User.Id
	res.Subtotal = &c.Subtotal

	for _, item := range c.Items {
		res.Cart = append(res.Cart, CartItemRes{
			Id:                item.Id,
			ProductId:         &item.Product.Id,
			Name:              &item.Product.Name,
			Quantity:          item.Quantity,
			PrescriptionId:    item.PrescriptionId,
			PharmacyProductId: item.PharmacyProductId,
			ThumbnailUrl:      &item.Product.ThumbnailUrl,
			SellingUnit:       &item.Product.SellingUnit,
			OrderId:           item.OrderId,
			Price:             item.PharmacyProduct.Price,
			MaxPrice:          &item.Product.MaxPrice,
		})
	}

	return res
}

func ToGetCartDetailsRes(c *entity.Cart) GetCartDetailsRes {
	res := GetCartDetailsRes{}
	res.UserId = c.User.Id
	res.Subtotal = &c.Subtotal
	cartPharmacyRes := make(map[int64]entity.Pharmacy)
	cartPharmacyNilRes := CartPharmacyRes{}

	for _, item := range c.Items {
		if item.Pharmacy.Id == nil {
			cartPharmacyNilRes.Items = append(cartPharmacyNilRes.Items, &CartItemRes{
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
				Weight:                 item.Product.Weight.IntPart(),
				IsPrescriptionRequired: item.Product.IsPrescriptionRequired,
				Price:                  item.PharmacyProduct.Price,
			})
			continue
		}
		cartPharmacyRes[*item.Pharmacy.Id] = item.Pharmacy
	}

	for _, pharmacy := range cartPharmacyRes {
		var totalWeight int64
		var subtotalPharmacy int
		cartItemRes := []*CartItemRes{}
		operationalDaysString := strings.TrimPrefix(*pharmacy.OperationalDays, "{")
		operationalDaysString = strings.TrimSuffix(operationalDaysString, "}")
		operationalDays := strings.Split(operationalDaysString, ",")

		for _, item := range c.Items {
			if item.Pharmacy.Id == nil {
				continue
			}
			if *pharmacy.Id == *item.Pharmacy.Id {
				totalWeight += (item.Product.Weight.IntPart() * int64(*item.Quantity))
				subtotalPharmacy += *item.Quantity * *item.PharmacyProduct.Price
				cartItemRes = append(cartItemRes, &CartItemRes{
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
					Weight:                 item.Product.Weight.IntPart(),
					IsPrescriptionRequired: item.Product.IsPrescriptionRequired,
					Price:                  item.PharmacyProduct.Price,
				})
			}
		}

		res.PharmaciesCart = append(res.PharmaciesCart, CartPharmacyRes{
			Id:                pharmacy.Id,
			Name:              pharmacy.Name,
			Address:           pharmacy.Address,
			CityId:            pharmacy.City.Id,
			Latitude:          pharmacy.Latitude,
			Longitude:         pharmacy.Longitude,
			PharmacistName:    pharmacy.PharmacistName,
			PharmacistLicense: pharmacy.PharmacistLicense,
			PharmacistPhone:   pharmacy.PharmacistPhone,
			OpeningTime:       pharmacy.OpeningTime,
			ClosingTime:       pharmacy.ClosingTime,
			OperationalDays:   operationalDays,
			PartnerId:         pharmacy.PartnerId,
			Distance:          pharmacy.Distance,
			SubtotalPharmacy:  subtotalPharmacy,
			TotalWeight:       totalWeight,
			Items:             cartItemRes,
		})
	}

	if len(cartPharmacyNilRes.Items) > 0 {
		res.PharmaciesCart = append(res.PharmaciesCart, cartPharmacyNilRes)
	}
	return res
}
