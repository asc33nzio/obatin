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

type UserOrdersFilter struct {
	Status *string
	Page   int
	Limit  int
}

type UserOrdersPagination struct {
	Orders     []*Order
	TotalRows  int64
	Pagination PaginationResponse
}
