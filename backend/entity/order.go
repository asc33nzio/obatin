package entity

import (
	"time"
)

type Order struct {
	Id           *int64
	User         User
	Shipping     Shipping
	Pharmacy     Pharmacy
	Status       string
	NumberItems  int
	ShippingCost int
	Subtotal     int
	Payment      Payment
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    *time.Time
	CartItems    []*CartItem
}
