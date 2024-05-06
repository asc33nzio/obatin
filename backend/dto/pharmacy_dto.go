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
	Latitude          *decimal.Decimal `json:"lat"`
	Longitude         *decimal.Decimal `json:"lng"`
	PharmacistName    *string          `json:"pharmacist_name"`
	PharmacistLicense *string          `json:"pharmacist_license"`
	PharmacistPhone   *string          `json:"pharmacist_phone"`
	OpeningTime       *string          `json:"opening_time"`
	ClosingTime       *string          `json:"closing_time"`
	OperationalDays   []string         `json:"operational_days"`
	PartnerId         *int64           `json:"partner_id"`
	Distance          *int             `json:"distance"`
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
