package entity

import "mime/multipart"

type Partner struct {
	Id               int64
	Name             string
	Logo             multipart.File
	AuthenticationId int64
	Email            string
	Password         string
	Role             string
	IsApproved       bool
	IsVerify         bool
	LogoURL          string
}

type PartnerListPage struct {
	Partners   []Partner
	TotalRows  int
	Pagination PaginationResponse
}

type PartnerFilter struct {
	Search string
	Page   int
	Limit  int
}

type PartnerUpdateRequest struct {
	Name     *string
	Logo     *multipart.File
	LogoURL  *string
	Email    *string
	Password *string
}
