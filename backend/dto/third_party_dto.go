package dto

type RajaOngkirCostReq struct {
	Origin      string `json:"origin" binding:"required"`
	Destination string `json:"destination" binding:"required"`
	Weight      int    `json:"weight" binding:"required,gte=1,max=30000"`
	Courier     string `json:"courier" binding:"required"`
}

type RajaOngkirCostRes struct {
	RajaOngkir RajaOngkirCostDetailsRes `json:"rajaongkir"`
}

type RajaOngkirCostDetailsRes struct {
	Query              RajaOngkirCostQueryRes       `json:"query"`
	Status             RajaOngkirCostStatusRes      `json:"status"`
	OriginDetails      RajaOngkirCostCityDetailsRes `json:"origin_details"`
	DestinationDetails RajaOngkirCostCityDetailsRes `json:"destination_details"`
	Results            []RajaOngkirCostResultsRes   `json:"results"`
}

type RajaOngkirCostQueryRes struct {
	Origin      string `json:"origin"`
	Destination string `json:"destination"`
	Weight      int    `json:"weight"`
	Courier     string `json:"courier"`
}

type RajaOngkirCostStatusRes struct {
	Code        int    `json:"code"`
	Description string `json:"description"`
}

type RajaOngkirCostCityDetailsRes struct {
	CityId     string `json:"city_id"`
	ProvinceId string `json:"province_id"`
	Province   string `json:"province"`
	Type       string `json:"type"`
	CityName   string `json:"city_name"`
	PostalCode string `json:"postal_code"`
}

type RajaOngkirCostResultsRes struct {
	Code  string                          `json:"code"`
	Name  string                          `json:"name"`
	Costs []RajaOngkirCostResultsCostsRes `json:"costs"`
}

type RajaOngkirCostResultsCostsRes struct {
	Service     string                              `json:"service"`
	Description string                              `json:"description"`
	Cost        []RajaOngkirCostResultsCostsCostRes `json:"cost"`
}

type RajaOngkirCostResultsCostsCostRes struct {
	Value     int    `json:"value"`
	Estimated string `json:"etd"`
	Note      string `json:"note"`
}
