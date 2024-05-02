package entity

import (
	"mime/multipart"
)

type Doctor struct {
	Id                        int64
	Specialization            int64
	Name                      string
	Avatar                    string
	Experiences               int
	Certificate               string
	Fee                       int64
	Opening                   string
	OperationalHours          string
	OperationalDays           string
	AuthenticationID          int64
	SpecializationName        string
	SpecializationDescription string
	Email                     string
	IsOnline                  bool
}

type DoctorDetail struct {
	Id                 int64
	SpecializationName string
	Name               string
	Avatar             string
	IsOnline           bool
	Experiences        int
	Certificate        string
	Fee                int64
	Opening            string
	OperationalHours   string
	OperationalDays    string
}

type DoctorList struct {
	Id               int64
	Specialization   string
	Name             string
	Avatar           string
	IsOnline         bool
	Experiences      int
	Fee              int64
	Opening          string
	OperationalHours string
	OperationalDays  string
}

type DoctorProfile struct {
	SpecializationName string
	Email              string
	Name               string
	Avatar             string
	IsOnline           bool
	Experiences        int
	Certificate        string
	Fee                int64
	Opening            string
	OperationalHours   string
	OperationalDays    string
}

type DoctorUpdateRequest struct {
	Name             *string
	AvatarFile       *multipart.File
	AvatarUrl        *string
	IsOnline         *bool
	Experiences      *int
	Fee              *int64
	Opening          *string
	OperationalHours *string
	OperationalDays  *string
}

type DoctorFilter struct {
	Search         string
	Specialization *string
	OnlineOnly     *bool
	SortBy         *string
	Order          *string
	Page           int
	Limit          int
}

type DoctorListPage struct {
	Doctors    []DoctorList
	TotalRows  int
	Pagination PaginationResponse
}

type DoctorApprovalPage struct {
	Doctors    []Doctor
	TotalRows  int
	Pagination PaginationResponse
}
