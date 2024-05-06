package entity

type Cart struct {
	User     User
	Subtotal int
	Items    []*CartItem
}

type CartItem struct {
	Id                 *int64
	OrderId            *int64
	UserId             *int64
	PrescriptionId     *int64
	PharmacyProductId  *int64
	Pharmacy           Pharmacy
	Product            ProductDetail
	Quantity           *int
	IsActive           *bool
	PharmacyProduct    PharmacyProduct
	AuthenticationId   int64
	PharmaciesProducts []*PharmacyProduct
}

type CartCheckout struct {
	User           User
	Payment        Payment
	PharmaciesCart []Order
}
