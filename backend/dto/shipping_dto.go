package dto

import (
	"obatin/appconstant"
	"obatin/entity"
)

type AvailableShippingsReq struct {
	PharmacyId        int64 `json:"pharmacy_id" binding:"required"`
	Distance          int   `json:"distance" binding:"required"`
	DestinationCityId int64 `json:"destination_city_id" binding:"required"`
	Weight            int   `json:"weight" binding:"required"`
}

type AvailableShippingsRes struct {
	PharmacyId        int64                `json:"pharmacy_id"`
	Distance          int                  `json:"distance"`
	DestinationCityId int64                `json:"destination_city_id"`
	Weight            int                  `json:"weight"`
	ShippingMethods   []ShippingsMethodRes `json:"shipping_methods"`
}

type ShippingsMethodRes struct {
	ShippingId       int64  `json:"shipping_id"`
	ShippingMethodId int64  `json:"shipping_method_id"`
	Name             string `json:"name"`
	Price            int    `json:"price"`
	Type             string `json:"type"`
	Service          string `json:"service"`
	Description      string `json:"description"`
	Code             string `json:"code"`
	Estimated        string `json:"estimated"`
}

func ToAvailableShippingsRes(
	shippings []*entity.Shipping,
	roRes []*RajaOngkirCostRes,
	body AvailableShippingsReq,
) AvailableShippingsRes {
	res := AvailableShippingsRes{}
	res.PharmacyId = body.PharmacyId
	res.Distance = body.Distance
	res.Weight = body.Weight
	res.DestinationCityId = body.DestinationCityId

	for _, s := range shippings {
		if s.ShippingMethod.Type == appconstant.OfficialShippingMethod {
			res.ShippingMethods = append(res.ShippingMethods, ShippingsMethodRes{
				ShippingId:       s.Id,
				ShippingMethodId: s.ShippingMethod.Id,
				Name:             *s.ShippingMethod.Name,
				Price:            *s.ShippingMethod.Price * body.Distance / 1000,
				Type:             s.ShippingMethod.Type,
				Service:          s.ShippingMethod.Service,
				Description:      *s.ShippingMethod.Description,
				Code:             s.ShippingMethod.Code,
				Estimated:        s.ShippingMethod.Estimated,
			})
			continue
		}

		for _, ro := range roRes {
			if s.ShippingMethod.Code == ro.RajaOngkir.Query.Courier {
				for _, service := range ro.RajaOngkir.Results[0].Costs {
					res.ShippingMethods = append(res.ShippingMethods, ShippingsMethodRes{
						ShippingId:       s.Id,
						ShippingMethodId: s.ShippingMethod.Id,
						Name:             ro.RajaOngkir.Results[0].Name,
						Price:            service.Cost[0].Value,
						Type:             s.ShippingMethod.Type,
						Service:          service.Service,
						Description:      service.Description,
						Code:             s.ShippingMethod.Code,
						Estimated:        service.Cost[0].Estimated,
					})
				}
			}
		}
	}

	return res
}
