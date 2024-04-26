package dto

import (
	"mime/multipart"
	"obatin/entity"
)

type PartnerListResponse struct {
	Id               int64  `json:"id"`
	Name             string `json:"name"`
	LogoUrl          string `json:"logo_url"`
	Email            string `json:"email,omitempty"`
	AuthenticationId int64  `json:"authentication_id,omitempty"`
}

type PartnerListPageResponse struct {
	Pagination *PaginationResponse   `json:"pagination,omitempty"`
	Data       []PartnerListResponse `json:"data,omitempty"`
}

type PartnerFilter struct {
	Search string `form:"search"`
	Page   int    `form:"page" binding:"omitempty,min=1"`
	Limit  int    `form:"limit" binding:"omitempty,min=1,max=25"`
}

func (p PartnerFilter) ToPartnerFilterEntity() entity.PartnerFilter {
	return entity.PartnerFilter{
		Search: p.Search,
		Page:   p.Page,
		Limit:  p.Limit,
	}
}

func ToPartnerListResponse(partners *entity.PartnerListPage) []PartnerListResponse {
	response := []PartnerListResponse{}
	for _, values := range partners.Partners {
		response = append(response, PartnerListResponse{
			Id:      values.Id,
			Name:    values.Name,
			LogoUrl: values.LogoURL,
		})
	}
	return response
}

type PartnerUpdateReq struct {
	Logo     *multipart.File
	Name     *string `form:"name"`
	Email    *string `form:"email"`
	Password *string `form:"password"`
}

type PartnerIdParam struct {
	Id int64 `uri:"id" binding:"required"`
}

func (c PartnerUpdateReq) ToPartnerUpdateBodyEntity(image multipart.File) entity.PartnerUpdateRequest {
	res := entity.PartnerUpdateRequest{
		Name:     c.Name,
		Logo:     c.Logo,
		Email:    c.Email,
		Password: c.Password,
	}
	if image != nil {
		res.Logo = &image
	}
	return res
}

func ToPartnerResponse(c *entity.Partner) PartnerListResponse {
	return PartnerListResponse{
		Id:               c.Id,
		Name:             c.Name,
		LogoUrl:          c.LogoURL,
		Email:            c.Email,
		AuthenticationId: c.AuthenticationId,
	}
}
