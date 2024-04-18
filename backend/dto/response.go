package dto

import "obatin/entity"

type APIResponse struct {
	Message    string              `json:"message"`
	Pagination *PaginationResponse `json:"pagination,omitempty"`
	Data       any                 `json:"data,omitempty"`
}

type PaginationResponse struct {
	Page         int   `json:"page"`
	PageCount    int64 `json:"page_count"`
	TotalRecords int64 `json:"total_records"`
	Limit        int   `json:"limit"`
}

type UserAccessToken struct {
	AccessToken string `json:"access_token"`
}

type UserRegisterRes struct {
	Email string `json:"email"`
}

type UserVerifiedRes struct {
	Email string `json:"email"`
}

func ToUserRegisterRes(u entity.Authentication) UserRegisterRes {
	return UserRegisterRes{
		Email: u.Email,
	}
}

func ToVerifyRegisterRes(u entity.Authentication) UserVerifiedRes {
	return UserVerifiedRes{
		Email: u.Email,
	}
}

type MediaDto struct {
	StatusCode int                    `json:"statusCode"`
	Message    string                 `json:"message"`
	Data       map[string]interface{} `json:"data"`
}
