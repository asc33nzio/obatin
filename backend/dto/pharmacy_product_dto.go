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

type PharmacyProductParam struct {
	PharmacyProductId string `uri:"pharmacy_product_id" binding:"required"`
}

type PharmacyProductFilter struct {
	Search         string  `form:"search"`
	SearchPharmacy string  `form:"search_pharmacy"`
	ProductId      *int64  `form:"product_id" binding:"omitempty"`
	PharmacyId     int64   `form:"pharmacy_id" binding:"omitempty"`
	SortBy         *string `form:"sort_by" binding:"omitempty,oneof='name' 'price' 'pharmacy' 'sales'"`
	Classification *string `form:"classification" binding:"omitempty,oneof='obat_bebas' 'obat_bebas_terbatas' 'non_obat' 'obat_keras'"`
	Order          *string `form:"order" binding:"omitempty,oneof='asc' 'desc'"`
	Page           int     `form:"page" binding:"omitempty,min=1"`
	Limit          int     `form:"limit" binding:"omitempty,min=1,max=25"`
}

type UpdatePharmacyProductReq struct {
	UpdateType              string `form:"update_type" binding:"required,oneof='stock_mutation' 'manual_addition' 'detail'"`
	Price                   *int   `form:"price" binding:"omitempty,min=500"`
	Delta                   *int   `form:"delta"`
	IsActive                *bool  `form:"is_active"`
	SourcePharmacyProductId *int64 `form:"source_pharmacy_product_id"`
	IsAddition              *bool  `form:"is_addition,omitempty"`
}

type PharmacyProduct struct {
	Id           int64  `json:"id"`
	ProductId    int64  `json:"product_id"`
	ProductName  string `json:"product_name"`
	ProductSlug  string `json:"slug"`
	ImageUrl     string `json:"image_url"`
	PharmacyId   int64  `json:"pharmacy_id"`
	PharmacyName string `json:"pharmacy_name"`
	Price        *int   `json:"price"`
	Stock        *int   `json:"stock"`
	IsActive     bool   `json:"is_active"`
	Sales        int64  `json:"sales"`
}

type CreatePharmacyProduct struct {
	ProductId  int64 `form:"product_id" binding:"required"`
	PharmacyId int64 `form:"pharmacy_id" binding:"required"`
	Price      int   `form:"price" binding:"required"`
	Stock      int   `form:"stock" binding:"required"`
	IsActive   bool  `form:"is_active" binding:"required"`
}

type PharmacyProductListPageResponse struct {
	Pagination *PaginationResponse `json:"pagination,omitempty"`
	Data       []PharmacyProduct   `json:"data,omitempty"`
}

func (pp TotalStockPerPartnerReq) ToPharmacyProduct() *entity.PharmacyProduct {
	return &entity.PharmacyProduct{
		Product:  entity.ProductDetail{Id: pp.ProductId},
		Pharmacy: entity.Pharmacy{PartnerId: &pp.PartnerId},
	}
}

func (body UpdatePharmacyProductReq) ToEntityUpdatePharmacyProduct() *entity.UpdatePharmacyProduct {
	return &entity.UpdatePharmacyProduct{
		UpdateType:              body.UpdateType,
		Price:                   body.Price,
		Delta:                   body.Delta,
		IsActive:                body.IsActive,
		SourcePharmacyProductId: body.SourcePharmacyProductId,
		IsAddition:              body.IsAddition,
	}
}

func (body CreatePharmacyProduct) ToEntityPharmacyProductFromCreate() *entity.PharmacyProduct {
	return &entity.PharmacyProduct{
		Product:  entity.ProductDetail{Id: body.ProductId},
		Pharmacy: entity.Pharmacy{Id: &body.PharmacyId},
		Price:    &body.Price,
		Stock:    &body.Stock,
		IsActive: body.IsActive,
	}
}

func (p PharmacyProductFilter) ToPharmacyProductFilterEntity() entity.PharmacyProductFilter {
	return entity.PharmacyProductFilter{
		Search:         p.Search,
		SearchPharmacy: p.SearchPharmacy,
		ProductId:      p.ProductId,
		PharmacyId:     p.PharmacyId,
		SortBy:         p.SortBy,
		Classification: p.Classification,
		Order:          p.Order,
		Page:           p.Page,
		Limit:          p.Limit,
	}
}

func ToTotalStockPerPartnerRes(pp *entity.PharmacyProduct) TotalStockPerPartnerRes {
	return TotalStockPerPartnerRes{
		ProductId:  pp.Product.Id,
		PartnerId:  *pp.Pharmacy.PartnerId,
		TotalStock: pp.TotalStock,
	}
}

func ToPharmacyProductResponse(pp []entity.PharmacyProduct) []PharmacyProduct {
	res := []PharmacyProduct{}
	for _, pharmacyProduct := range pp {
		res = append(res, PharmacyProduct{
			Id:           pharmacyProduct.Id,
			ProductId:    pharmacyProduct.Product.Id,
			ProductName:  pharmacyProduct.Product.Name,
			ProductSlug:  pharmacyProduct.Product.Slug,
			ImageUrl:     pharmacyProduct.Product.ImageUrl,
			PharmacyId:   *pharmacyProduct.Pharmacy.Id,
			PharmacyName: *pharmacyProduct.Pharmacy.Name,
			Price:        pharmacyProduct.Price,
			Stock:        pharmacyProduct.Stock,
			IsActive:     pharmacyProduct.IsActive,
			Sales:        pharmacyProduct.Sales,
		})
	}
	return res
}
