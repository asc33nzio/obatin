package entity

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
	WantDelete   bool
	CreatedAt    string
	CartItems    []*CartItem
}

type OrdersFilter struct {
	InvoiceNumber *string
	UserId        *int64
	PharmacyId    *int64
	Status        *string
	PartnerId     *int64
	Page          int
	Limit         int
}

type OrdersPagination struct {
	Orders     []*Order
	TotalRows  int64
	Pagination PaginationResponse
}
