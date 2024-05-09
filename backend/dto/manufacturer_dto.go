package dto

import "obatin/entity"

type ManufacturerResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"manufacturer_name"`
}

type ManufacturerFilter struct {
	Search string  `form:"search"`
	SortBy *string `form:"sort_by" binding:"omitempty,oneof='name'"`
	Order  *string `form:"order" binding:"omitempty,oneof='asc' 'desc'"`
	Page   int     `form:"page" binding:"omitempty,min=1"`
	Limit  int     `form:"limit" binding:"omitempty,min=1,max=25"`
}

type ManufacturerListPageResponse struct {
	Pagination *PaginationResponse    `json:"pagination,omitempty"`
	Data       []ManufacturerResponse `json:"data,omitempty"`
}

func ToManufacturerListResponse(manufacturers *entity.ManufacturerListPage) []ManufacturerResponse {
	response := []ManufacturerResponse{}
	for _, values := range manufacturers.Manufacturers {
		response = append(response, ManufacturerResponse{
			ID:   values.ID,
			Name: values.Name,
		})
	}
	return response
}

func (f ManufacturerFilter) ToManufacturerFilterEntity() *entity.ManufacturerFilter {
	return &entity.ManufacturerFilter{
		Search: f.Search,
		SortBy: f.SortBy,
		Order:  f.Order,
		Limit:  f.Limit,
		Page:   f.Page,
	}
}
