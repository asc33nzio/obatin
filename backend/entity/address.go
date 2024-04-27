package entity

import "github.com/shopspring/decimal"

type Address struct {
	Id               *int64
	UserId           *int64
	Alias            *string
	City             City
	Detail           *string
	Longitude        *decimal.Decimal
	Latitude         *decimal.Decimal
	AuthenticationId *int64
}
