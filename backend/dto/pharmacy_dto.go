package dto

import (
	"obatin/entity"
	"strings"

	"github.com/shopspring/decimal"
)

type GetOnePharmacyRes struct {
	Id                *int64           `json:"id"`
	Name              *string          `json:"name"`
	Address           *string          `json:"address"`
	CityId            *int64           `json:"city_id"`
	City              *string          `json:"city" binding:"omitempty"`
	Latitude          *decimal.Decimal `json:"lat"`
	Longitude         *decimal.Decimal `json:"lng"`
	PharmacistName    *string          `json:"pharmacist_name"`
	PharmacistLicense *string          `json:"pharmacist_license"`
	PharmacistPhone   *string          `json:"pharmacist_phone"`
	OpeningTime       *string          `json:"opening_time"`
	ClosingTime       *string          `json:"closing_time"`
	OperationalDays   []string         `json:"operational_days"`
	PartnerId         *int64           `json:"partner_id"`
	Distance          *int             `json:"distance,omitempty"`
}

type PharmacyFilter struct {
	Search    string  `form:"search"`
	City      *string `form:"city" binding:"omitempty"`
	PartnerId *int64  `form:"partner_id" binding:"omitempty"`
	Page      int     `form:"page" binding:"omitempty"`
	Limit     int     `form:"limit" binding:"omitempty"`
}

type PharmacyListPageResponse struct {
	Pagination *PaginationResponse `json:"pagination,omitempty"`
	Data       []GetOnePharmacyRes `json:"data,omitempty"`
}

func (f PharmacyFilter) ToEntityFilter() *entity.PharmacyFilter {
	return &entity.PharmacyFilter{
		Search:    f.Search,
		City:      f.City,
		PartnerId: f.PartnerId,
		Limit:     f.Limit,
		Page:      f.Page,
	}
}

func ToPharmacyListResponse(pharmacies *entity.PharmacyListPage) []GetOnePharmacyRes {
	response := []GetOnePharmacyRes{}
	for _, values := range pharmacies.Pharmacies {
		operationalDaysString := strings.TrimPrefix(*values.OperationalDays, "{")
		operationalDaysString = strings.TrimSuffix(operationalDaysString, "}")
		operationalDays := strings.Split(operationalDaysString, ",")

		response = append(response, GetOnePharmacyRes{
			Id:                values.Id,
			Name:              values.Name,
			Address:           values.Address,
			CityId:            values.City.Id,
			City:              values.City.Name,
			Latitude:          values.Latitude,
			Longitude:         values.Longitude,
			OpeningTime:       values.OpeningTime,
			ClosingTime:       values.ClosingTime,
			OperationalDays:   operationalDays,
			PharmacistName:    values.PharmacistName,
			PharmacistLicense: values.PharmacistLicense,
			PharmacistPhone:   values.PharmacistPhone,
			PartnerId:         values.PartnerId,
			Distance:          values.Distance,
		})
	}
	return response
}

func ToGetNearbyPharmaciesRes(pharmacies []*entity.Pharmacy) []GetOnePharmacyRes {
	res := []GetOnePharmacyRes{}

	for _, p := range pharmacies {
		operationalDaysString := strings.TrimPrefix(*p.OperationalDays, "{")
		operationalDaysString = strings.TrimSuffix(operationalDaysString, "}")
		operationalDays := strings.Split(operationalDaysString, ",")

		res = append(res, GetOnePharmacyRes{
			Id:                p.Id,
			Name:              p.Name,
			Address:           p.Address,
			CityId:            p.City.Id,
			Latitude:          p.Latitude,
			Longitude:         p.Longitude,
			PharmacistName:    p.PharmacistName,
			PharmacistLicense: p.PharmacistLicense,
			PharmacistPhone:   p.PharmacistPhone,
			OpeningTime:       p.OpeningTime,
			ClosingTime:       p.ClosingTime,
			OperationalDays:   operationalDays,
			PartnerId:         p.PartnerId,
			Distance:          p.Distance,
		})
	}

	return res
}
