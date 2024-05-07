package dto

import "obatin/entity"

type TotalStockPerPartnerReq struct {
	ProductId int64 `json:"product_id" binding:"required,gte=1"`
	PartnerId int64 `json:"partner_id" binding:"required,gte=1"`
}

type TotalStockPerPartnerRes struct {
	ProductId  int64 `json:"product_id"`
	PartnerId  int64 `json:"partner_id"`
	TotalStock int   `json:"total_stock"`
}

func (pp TotalStockPerPartnerReq) ToPharmacyProduct() *entity.PharmacyProduct {
	return &entity.PharmacyProduct{
		Product:  entity.ProductDetail{Id: pp.ProductId},
		Pharmacy: entity.Pharmacy{PartnerId: &pp.PartnerId},
	}
}

func ToTotalStockPerPartnerRes(pp *entity.PharmacyProduct) TotalStockPerPartnerRes {
	return TotalStockPerPartnerRes{
		ProductId:  pp.Product.Id,
		PartnerId:  *pp.Pharmacy.PartnerId,
		TotalStock: pp.TotalStock,
	}
}
