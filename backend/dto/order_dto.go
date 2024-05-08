package dto

import (
	"fmt"
	"obatin/appconstant"
	"obatin/entity"
	"strings"
)

type UserOrdersFilter struct {
	Status *string `form:"status" binding:"omitempty,oneof='waiting_payment' 'waiting_confirmation' 'processed' 'sent' 'confirmed' 'cancelled'"`
	Page   int     `form:"page" binding:"omitempty,min=1"`
	Limit  int     `form:"limit" binding:"omitempty,min=1,max=25"`
}

type UserOrderRes struct {
	Id            int64            `json:"order_id"`
	PaymentId     int64            `json:"payment_id"`
	InvoiceNumber string           `json:"invoice_number"`
	Status        string           `json:"status"`
	NumberItems   int              `json:"number_items"`
	Subtotal      int              `json:"subtotal"`
	CreatedAt     string           `json:"created_at"`
	Shipping      ShippingOrderRes `json:"shipping"`
	Pharmacy      CartPharmacyRes  `json:"pharmacy"`
	CartItems     []*CartItemRes   `json:"cart_items"`
}

type ShippingOrderRes struct {
	Cost int    `json:"cost"`
	Code string `json:"code"`
	Name string `json:"name"`
	Type string `json:"type"`
}

func (f UserOrdersFilter) ToUserOrdersFilterEntity() *entity.UserOrdersFilter {
	return &entity.UserOrdersFilter{
		Status: f.Status,
		Limit:  f.Limit,
		Page:   f.Page,
	}
}

func ToUserOrdersRes(orders []*entity.Order) []*UserOrderRes {
	res := []*UserOrderRes{}

	for _, o := range orders {
		oRes := UserOrderRes{}
		date := strings.Fields(o.CreatedAt)
		oRes.Id = *o.Id
		oRes.PaymentId = o.Payment.Id
		oRes.InvoiceNumber = fmt.Sprintf("%v-%v-%d", appconstant.InvoicePrefix, date[0], o.Payment.Id)
		oRes.Status = o.Status
		oRes.NumberItems = o.NumberItems
		oRes.Subtotal = o.Subtotal
		oRes.CreatedAt = o.CreatedAt
		operationalDaysString := strings.TrimPrefix(*o.Pharmacy.OperationalDays, "{")
		operationalDaysString = strings.TrimSuffix(operationalDaysString, "}")
		operationalDays := strings.Split(operationalDaysString, ",")
		oRes.Shipping = ShippingOrderRes{
			Cost: o.ShippingCost,
			Code: o.Shipping.ShippingMethod.Code,
			Name: *o.Shipping.ShippingMethod.Name,
			Type: o.Shipping.ShippingMethod.Type,
		}
		oRes.Pharmacy = CartPharmacyRes{
			Id:                o.Pharmacy.Id,
			Name:              o.Pharmacy.Name,
			Address:           o.Pharmacy.Address,
			CityId:            o.Pharmacy.City.Id,
			Latitude:          o.Pharmacy.Latitude,
			Longitude:         o.Pharmacy.Longitude,
			PharmacistName:    o.Pharmacy.PharmacistName,
			PharmacistLicense: o.Pharmacy.PharmacistLicense,
			PharmacistPhone:   o.Pharmacy.PharmacistPhone,
			OpeningTime:       o.Pharmacy.OpeningTime,
			ClosingTime:       o.Pharmacy.ClosingTime,
			OperationalDays:   operationalDays,
			PartnerId:         o.Pharmacy.PartnerId,
		}

		for _, ci := range o.CartItems {
			oRes.CartItems = append(oRes.CartItems, &CartItemRes{
				Id:                     ci.Id,
				ProductId:              &ci.Product.Id,
				PharmacyProductId:      ci.PharmacyProductId,
				Name:                   &ci.Product.Name,
				ThumbnailUrl:           &ci.Product.ThumbnailUrl,
				SellingUnit:            &ci.Product.SellingUnit,
				IsPrescriptionRequired: ci.Product.IsPrescriptionRequired,
				Weight:                 ci.Product.Weight.IntPart(),
				Slug:                   ci.Product.Slug,
				PrescriptionId:         ci.PrescriptionId,
				Quantity:               ci.Quantity,
				OrderId:                ci.OrderId,
				Price:                  ci.PharmacyProduct.Price,
			})
		}

		res = append(res, &oRes)
	}

	return res
}
