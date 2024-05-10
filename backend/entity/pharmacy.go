package entity

import (
	"github.com/shopspring/decimal"
)

type Pharmacy struct {
	Id                *int64
	Name              *string
	Address           *string
	City              City
	Latitude          *decimal.Decimal
	Longitude         *decimal.Decimal
	OpeningTime       *string
	ClosingTime       *string
	OperationalHours  *string
	OperationalDays   *string
	PharmacistName    *string
	PharmacistLicense *string
	PharmacistPhone   *string
	PartnerId         *int64
	Distance          *int
	ShippingMethods   []*ShippingMethod
}

type PharmacyListPage struct {
	Pharmacies   []Pharmacy
	TotalRows  int
	Pagination PaginationResponse
}

type PharmacyFilter struct {
	Search    string
	City      *string
	PartnerId *int64
	Page      int
	Limit     int
}
