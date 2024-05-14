package dto

import "obatin/entity"

type StockMovementFilter struct {
	PharmacyId *int64 `form:"pharmacy_id" binding:"omitempty"`
	ProductId  *int64 `form:"product_id" binding:"omitempty"`
	PartnerId  *int64 `form:"partner_id" binding:"omitempty"`
	Page       int    `form:"page" binding:"omitempty,min=1"`
	Limit      int    `form:"limit" binding:"omitempty,min=1,max=25"`
}

type StockMovementRes struct {
	Id                int64  `json:"id"`
	PharmacyProductId int64  `json:"pharmacy_product_id"`
	Delta             int    `json:"delta"`
	IsAddition        bool   `json:"is_addition"`
	MovementType      string `json:"movement_type"`
	CreatedAt         string `json:"created_at"`
	ProductId         int64  `json:"product_id"`
	ProductName       string `json:"product_name"`
	PharmacyId        int64  `json:"pharmacy_id"`
	PharmacyName      string `json:"pharmacy_name"`
}

func (s StockMovementFilter) ToFilterEntity() *entity.StockMovementFilter {
	return &entity.StockMovementFilter{
		PharmacyId: s.PharmacyId,
		PartnerId:  s.PartnerId,
		ProductId:  s.ProductId,
		Page:       s.Page,
		Limit:      s.Limit,
	}
}

func ToGetAllStockMovementRes(stockMovements []*entity.StockMovement) []StockMovementRes {
	res := []StockMovementRes{}

	for _, s := range stockMovements {
		res = append(res, StockMovementRes{
			Id:                s.Id,
			PharmacyProductId: s.PharmacyProduct.Id,
			Delta:             s.Delta,
			IsAddition:        s.IsAddition,
			MovementType:      s.MovementType,
			CreatedAt:         s.CreatedAt,
			ProductId:         s.PharmacyProduct.Product.Id,
			ProductName:       s.PharmacyProduct.Product.Name,
			PharmacyId:        *s.PharmacyProduct.Pharmacy.Id,
			PharmacyName:      *s.PharmacyProduct.Pharmacy.Name,
		})
	}

	return res
}
