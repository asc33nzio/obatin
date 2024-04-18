package dto

import (
	"obatin/entity"
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

type ProductListResponse struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"product_slug"`
	SellingUnit string `json:"selling_unit"`
	MinPrice    int    `json:"min_price"`
	MaxPrice    int    `json:"max_price"`
	ImageUrl    string `json:"image_url"`
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

func ToProductListResponse(products *entity.ProductListPage) []ProductListResponse {
	response := []ProductListResponse{}
	for _, values := range products.Products {
		response = append(response, ProductListResponse{
			Id:          values.Id,
			Name:        values.Name,
			Slug:        values.Slug,
			SellingUnit: values.SellingUnit,
			MinPrice:    values.MinPrice,
			MaxPrice:    values.MaxPrice,
			ImageUrl:    values.ImageUrl,
		})
	}
	return response
}
