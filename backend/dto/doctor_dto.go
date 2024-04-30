package dto

import (
	"mime/multipart"
	"obatin/entity"
	"strings"
	"time"
)

type DoctorFilter struct {
	Search         string  `form:"search"`
	Specialization *string `form:"specialization" binding:"omitempty"`
	OnlineOnly     *bool   `form:"online_only" binding:"omitempty"`
	SortBy         *string `form:"sort_by" binding:"omitempty"`
	Order          *string `form:"order" binding:"omitempty"`
	Page           int     `form:"page" binding:"omitempty,min=1"`
	Limit          int     `form:"limit" binding:"omitempty,min=1,max=25"`
}

type DoctorListResponse struct {
	Id               int64    `json:"id"`
	Specialization   string   `json:"specialization"`
	Name             string   `json:"name"`
	Avatar           string   `json:"avatar_url"`
	IsOnline         bool     `json:"is_online"`
	Experiences      int      `json:"experiences"`
	Fee              int64    `json:"fee"`
	Opening          string   `json:"opening_time"`
	OperationalHours string   `json:"operational_hours"`
	OperationalDays  []string `json:"operational_days"`
}

type DoctorDetailResponse struct {
	Id                 int64  `json:"id"`
	SpecializationName string `json:"specialization,omitempty"`
	Name               string `json:"name"`
	Avatar             string `json:"avatar_url"`
	IsOnline           bool   `json:"is_online"`
	Experiences        int    `json:"experiences"`
	Certificate        string `json:"certificate,omitempty"`
	Fee                int64  `json:"fee"`
	Opening            string `json:"opening_time"`
	OperationalHours   string `json:"operational_hours"`
	OperationalDays    string `json:"operational_days"`
}

type DoctorUpdateRequest struct {
	Name             *string `form:"name" binding:"omitempty"`
	IsOnline         *bool   `form:"is_online" binding:"omitempty"`
	Experiences      *int    `form:"experiences" binding:"omitempty" validate:"number"`
	Fee              *int64  `form:"fee" binding:"omitempty"`
	Opening          *string `form:"opening_time" binding:"omitempty"`
	OperationalHours *int    `form:"operational_hours" binding:"omitempty"`
	OperationalDays  *string `form:"operational_days" binding:"omitempty"`
}

type DoctorListPageResponse struct {
	Pagination *PaginationResponse  `json:"pagination,omitempty"`
	Data       []DoctorListResponse `json:"data,omitempty"`
}

type DoctorIdParam struct {
	Id string `uri:"doctor_id" binding:"required"`
}

func (request DoctorUpdateRequest) ToDoctorUpdateBody(image multipart.File) entity.DoctorUpdateRequest {

	var formattedOperationalHours string
	if request.OperationalHours != nil {
		operationalHours := time.Duration(*request.OperationalHours) * time.Hour
		formattedOperationalHours = time.Unix(0, 0).UTC().Add(time.Duration(operationalHours)).Format("15:04:05")
	}

	var formattedOperationalDays strings.Builder
	if request.OperationalDays != nil {
		formattedOperationalDays.WriteString("{")
		formattedOperationalDays.WriteString(*request.OperationalDays)
		formattedOperationalDays.WriteString("}")
	}
	resOperational := formattedOperationalDays.String()

	return entity.DoctorUpdateRequest{
		Name:             request.Name,
		AvatarFile:       &image,
		IsOnline:         request.IsOnline,
		Experiences:      request.Experiences,
		Fee:              request.Fee,
		Opening:          request.Opening,
		OperationalHours: &formattedOperationalHours,
		OperationalDays:  &resOperational,
	}
}

func ToDoctorListResponse(doctors *entity.DoctorListPage) []DoctorListResponse {
	response := []DoctorListResponse{}
	for _, values := range doctors.Doctors {
		operationalDays := values.OperationalDays
		operationalDays = strings.Replace(operationalDays, "{", "", -1)
		operationalDays = strings.Replace(operationalDays, "}", "", -1)
		operationalDaysSlice := strings.Split(operationalDays, ",")
		response = append(response, DoctorListResponse{
			Id:               values.Id,
			Specialization:   values.Specialization,
			Name:             values.Name,
			Avatar:           values.Avatar,
			IsOnline:         values.IsOnline,
			Experiences:      values.Experiences,
			Fee:              values.Fee,
			Opening:          values.Opening,
			OperationalHours: values.OperationalHours,
			OperationalDays:  operationalDaysSlice,
		})
	}
	return response
}

func ToDoctorDetailResponse(doctor *entity.DoctorDetail) DoctorDetailResponse {
	return DoctorDetailResponse{
		Id:                 doctor.Id,
		SpecializationName: doctor.SpecializationName,
		Name:               doctor.Name,
		Avatar:             doctor.Avatar,
		IsOnline:           doctor.IsOnline,
		Experiences:        doctor.Experiences,
		Certificate:        doctor.Certificate,
		Fee:                doctor.Fee,
		Opening:            doctor.Opening,
		OperationalHours:   doctor.OperationalHours,
		OperationalDays:    doctor.OperationalDays,
	}
}

func (d DoctorFilter) ToDoctorFilterEntity() entity.DoctorFilter {
	return entity.DoctorFilter{
		Search:         d.Search,
		Specialization: d.Specialization,
		OnlineOnly:     d.OnlineOnly,
		SortBy:         d.SortBy,
		Order:          d.Order,
		Page:           d.Page,
		Limit:          d.Limit,
	}
}

type DoctorListResponseChat struct {
	Id                        int64  `json:"id"`
	AuthenticationId          int64  `json:"authentication_id"`
	Name                      string `json:"name"`
	Avatar                    string `json:"avatar_url,omitempty"`
	IsOnline                  bool   `json:"is_online,omitempty"`
	Experiences               int    `json:"experiences,omitempty"`
	Certificate               string `json:"certificate_url,omitempty"`
	Fee                       int64  `json:"fee,omitempty"`
	Opening                   string `json:"opening_time,omitempty"`
	OperationalHours          string `json:"operational_hours,omitempty"`
	OperationalDays           string `json:"operational_days,omitempty"`
	Specializations           int64  `json:"doctor_specialization_id,omitempty"`
	SpecializationName        string `json:"doctor_specialization_name,omitempty"`
	SpecializationDescription string `json:"doctor_specialization_description,omitempty"`
}

func ToDoctorDetailRes(u *entity.Doctor) DoctorListResponseChat {
	return DoctorListResponseChat{
		Id:                        u.Id,
		AuthenticationId:          u.AuthenticationID,
		Name:                      u.Name,
		Avatar:                    u.Avatar,
		IsOnline:                  u.IsOnline,
		Experiences:               u.Experiences,
		Certificate:               u.Certificate,
		Fee:                       u.Fee,
		Opening:                   u.Opening,
		OperationalHours:          u.OperationalHours,
		OperationalDays:           u.OperationalDays,
		Specializations:           u.Specialization,
		SpecializationName:        u.SpecializationName,
		SpecializationDescription: u.SpecializationDescription,
	}
}
