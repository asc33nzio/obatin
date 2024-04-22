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

type OneDoctorSpecializationRes struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Slug        string `json:"slug"`
}

func ToGetAllSpecializationsRes(specializations []entity.DoctorSpecialization) []OneDoctorSpecializationRes {
	res := []OneDoctorSpecializationRes{}

	for _, ds := range specializations {
		res = append(res, OneDoctorSpecializationRes{
			Id:          ds.Id,
			Name:        ds.Name,
			ImageURL:    ds.ImageURL,
			Description: ds.Description,
			Slug:        ds.Slug,
		})
	}

	return res
}

type OneDoctorPendingApprovalRes struct {
	AuthenticationID          int    `json:"authentication_id"`
	Email                     string `json:"email"`
	Cerificate                string `json:"ceritificate_url"`
	SpecializationName        string `json:"specialization_name"`
	SpecializationDescription string `json:"specialization_description"`
}

func ToGetAllDoctorPendingApprovalRes(pendingApprovals []entity.Doctor) []OneDoctorPendingApprovalRes {
	res := []OneDoctorPendingApprovalRes{}

	for _, pa := range pendingApprovals {
		res = append(res, OneDoctorPendingApprovalRes{
			AuthenticationID:          int(pa.AuthenticationID),
			Email:                     pa.Email,
			Cerificate:                pa.Certificate,
			SpecializationName:        pa.SpecializationName,
			SpecializationDescription: pa.SpecializationDescription,
		})
	}

	return res
}
