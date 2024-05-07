package dto

import (
	"obatin/entity"

	"github.com/shopspring/decimal"
)

type ProductFilter struct {
	Search         string  `form:"search"`
	Category       string  `form:"category"`
	SortBy         *string `form:"sort_by" binding:"omitempty,oneof='name' 'price'"`
	Classification *string `form:"classification" binding:"omitempty,oneof='obat_bebas' 'obat_bebas_terbatas' 'non_obat' 'obat_keras'"`
	Order          *string `form:"order" binding:"omitempty,oneof='asc' 'desc'"`
	Page           int     `form:"page" binding:"omitempty,min=1"`
	Limit          int     `form:"limit" binding:"omitempty,min=1,max=25"`
}

type ProductSlugParam struct {
	Slug string `uri:"product_slug" binding:"required"`
}

type ProductIdUriParam struct {
	Id int64 `uri:"id" binding:"required"`
}

type ProductDetailResponse struct {
	Id                     int64                `json:"id"`
	Name                   string               `json:"name"`
	MinPrice               int                  `json:"min_price"`
	MaxPrice               int                  `json:"max_price"`
	Slug                   string               `json:"product_slug"`
	GenericName            string               `json:"generic_name"`
	GeneralIndication      string               `json:"general_indication"`
	Dosage                 string               `json:"dosage"`
	HowToUse               string               `json:"how_to_use"`
	SideEffects            string               `json:"side_effects"`
	Contraindication       string               `json:"contraindication"`
	Warning                string               `json:"warning"`
	BpomNumber             string               `json:"bpom_number"`
	Content                string               `json:"content"`
	Description            string               `json:"description"`
	Classification         string               `json:"classification"`
	Packaging              string               `json:"packaging"`
	SellingUnit            string               `json:"selling_unit"`
	Weight                 decimal.Decimal      `json:"weight"`
	Height                 decimal.Decimal      `json:"height"`
	Length                 decimal.Decimal      `json:"length"`
	Width                  decimal.Decimal      `json:"width"`
	ImageUrl               string               `json:"image_url"`
	ThumbnailUrl           string               `json:"thumbnail_url"`
	IsActive               bool                 `json:"is_active"`
	IsPrescriptionRequired bool                 `json:"is_prescription_required"`
	Manufacturer           ManufacturerResponse `json:"manufacturer"`
}

type ManufacturerResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type ProductListResponse struct {
	Id                     int64  `json:"id"`
	Name                   string `json:"name"`
	Slug                   string `json:"product_slug"`
	SellingUnit            string `json:"selling_unit"`
	MinPrice               int    `json:"min_price"`
	MaxPrice               int    `json:"max_price"`
	ImageUrl               string `json:"image_url"`
	IsPrescriptionRequired bool   `json:"is_prescription_required"`
}

type ProductListPageResponse struct {
	Pagination *PaginationResponse   `json:"pagination,omitempty"`
	Data       []ProductListResponse `json:"data,omitempty"`
}

func (p ProductFilter) ToProductFilterEntity() entity.ProductFilter {
	return entity.ProductFilter{
		Search:         p.Search,
		Category:       p.Category,
		SortBy:         p.SortBy,
		Classification: p.Classification,
		Order:          p.Order,
		Page:           p.Page,
		Limit:          p.Limit,
	}
}

func ToProductDetailResponse(product *entity.ProductDetail) ProductDetailResponse {

	return ProductDetailResponse{
		Id:                     product.Id,
		Name:                   product.Name,
		MinPrice:               product.MinPrice,
		MaxPrice:               product.MaxPrice,
		Slug:                   product.Slug,
		GenericName:            product.GenericName,
		GeneralIndication:      product.GeneralIndication,
		Dosage:                 product.Dosage,
		HowToUse:               product.HowToUse,
		SideEffects:            product.SideEffects,
		Contraindication:       product.Contraindication,
		Warning:                product.Warning,
		BpomNumber:             product.BpomNumber,
		Content:                product.Content,
		Description:            product.Description,
		Classification:         product.Classification,
		Packaging:              product.Packaging,
		SellingUnit:            product.SellingUnit,
		Weight:                 product.Weight,
		Height:                 product.Height,
		Length:                 product.Length,
		Width:                  product.Width,
		ImageUrl:               product.ImageUrl,
		ThumbnailUrl:           product.ThumbnailUrl,
		IsActive:               product.IsActive,
		IsPrescriptionRequired: product.IsPrescriptionRequired,
		Manufacturer: ManufacturerResponse{
			ID:   product.Manufacturer.ID,
			Name: product.Manufacturer.Name,
		},
	}
}

func ToProductListResponse(products *entity.ProductListPage) []ProductListResponse {
	response := []ProductListResponse{}
	for _, values := range products.Products {
		response = append(response, ProductListResponse{
			Id:                     values.Id,
			Name:                   values.Name,
			Slug:                   values.Slug,
			SellingUnit:            values.SellingUnit,
			MinPrice:               values.MinPrice,
			MaxPrice:               values.MaxPrice,
			ImageUrl:               values.ImageUrl,
			IsPrescriptionRequired: values.IsPrescriptionRequired,
		})
	}
	return response
}
