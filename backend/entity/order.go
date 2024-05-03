package entity

type Order struct {
	Id           int64
	User         User
	Shipping     Shipping
	Pharmacy     Pharmacy
	Status       string
	NumberItems  int
	ShippingCost int
	Subtotal     int
	Payment      Payment
}
