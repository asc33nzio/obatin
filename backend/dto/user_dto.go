package dto

import (
	"mime/multipart"
	"obatin/appconstant"
	"obatin/entity"
	"time"
)

type GetUserRes struct {
	Id              int64           `json:"id"`
	Name            string          `json:"name"`
	Avatar          string          `json:"avatar_url"`
	Email           string          `json:"email"`
	BirthDate       string          `json:"birth_date"`
	Gender          string          `json:"gender"`
	ActiveAddressId *int64          `json:"active_address_id"`
	Addresses       []GetAddressRes `json:"addresses"`
}

type UserUpdateDetailsFormReq struct {
	Name             *string    `form:"name"`
	BirthDate        *time.Time `form:"birth_date" time_format:"2006-01-02"`
	Gender           *string    `form:"gender"`
	ActiveAddressId  *int64     `form:"active_address_id"`
	AvatarImage      multipart.File
	AuthenticationId int64
}

type UserAuthIdUriParam struct {
	Id int64 `uri:"authentication_id"`
}

func (r UserUpdateDetailsFormReq) ToUpdateUser() *entity.UpdateUser {
	return &entity.UpdateUser{
		Name:             r.Name,
		Gender:           r.Gender,
		BirthDate:        r.BirthDate,
		AvatarImage:      r.AvatarImage,
		AuthenticationId: r.AuthenticationId,
		ActiveAddressId:  r.ActiveAddressId,
	}
}

func ToGetUserRes(u *entity.User) GetUserRes {
	addresses := []GetAddressRes{}
	for _, address := range u.Addresses {
		addresses = append(addresses, GetAddressRes{
			Id:    address.Id,
			Alias: address.Alias,
			City: GetCityRes{
				Id:         address.City.Id,
				Name:       address.City.Name,
				PostalCode: address.City.PostalCode,
				Type:       address.City.Type,
				Province: GetProvinceRes{
					Id:   address.City.Province.Id,
					Name: address.City.Province.Name,
				},
			},
			Detail:    address.Detail,
			Longitude: address.Longitude,
			Latitude:  address.Latitude,
		})
	}

	return GetUserRes{
		Id:              *u.Id,
		Name:            *u.Name,
		Avatar:          *u.Avatar,
		Email:           u.Authentication.Email,
		BirthDate:       u.BirthDate.Format(appconstant.RFC3339TimeFormat),
		Gender:          *u.Gender,
		ActiveAddressId: u.ActiveAddress.Id,
		Addresses:       addresses,
	}
}

type UserListResponse struct {
	Id               int64  `json:"id"`
	Name             string `json:"logo_url"`
	BirthDate        string `json:"birth_date,omitempty"`
	Gender           string `json:"gender,omitempty"`
	Avatar           string `json:"avatar,omitempty"`
	AuthenticationId int64  `json:"authentication_id"`
}
