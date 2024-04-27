package dto

import (
	"obatin/entity"

	"github.com/shopspring/decimal"
)

type CreateAddressReq struct {
	Alias     string          `json:"alias" binding:"required"`
	CityId    int64           `json:"city_id" bindig:"required,gte=1"`
	Detail    string          `json:"detail" binding:"required"`
	Longitude decimal.Decimal `json:"lng" binding:"required"`
	Latitude  decimal.Decimal `json:"lat" binding:"required"`
}

type UpdateAddressReq struct {
	Alias     *string          `json:"alias"`
	CityId    *int64           `json:"city_id" binding:"omitempty,gte=1"`
	Detail    *string          `json:"detail"`
	Longitude *decimal.Decimal `json:"lng" binding:"required_with=Latitude"`
	Latitude  *decimal.Decimal `json:"lat" binding:"required_with=Longitude"`
}

type GetAddressRes struct {
	Id        *int64           `json:"id"`
	UserId    *int64           `json:"user_id,omitempty"`
	Alias     *string          `json:"alias"`
	City      GetCityRes       `json:"city"`
	Detail    *string          `json:"detail"`
	Longitude *decimal.Decimal `json:"longitude"`
	Latitude  *decimal.Decimal `json:"latitude"`
}

type AddressIdUriParam struct {
	Id int64 `uri:"address_id"`
}

func (a CreateAddressReq) ToAddress(authentiactionId int64) *entity.Address {
	return &entity.Address{
		Alias:            &a.Alias,
		City:             entity.City{Id: &a.CityId},
		Detail:           &a.Detail,
		Longitude:        &a.Longitude,
		Latitude:         &a.Latitude,
		AuthenticationId: &authentiactionId,
	}
}

func (a UpdateAddressReq) ToAddress(authentiactionId int64, addressId int64) *entity.Address {
	return &entity.Address{
		Id:               &addressId,
		Alias:            a.Alias,
		City:             entity.City{Id: a.CityId},
		Detail:           a.Detail,
		Longitude:        a.Longitude,
		Latitude:         a.Latitude,
		AuthenticationId: &authentiactionId,
	}
}
