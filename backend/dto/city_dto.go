package dto

type GetCityRes struct {
	Id         *int64         `json:"id"`
	Name       *string        `json:"name"`
	PostalCode *string        `json:"postal_code"`
	Type       *string        `json:"type"`
	Province   GetProvinceRes `json:"province"`
}
