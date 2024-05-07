package entity

type Shipping struct {
	Id             int64
	ShippingMethod ShippingMethod
	Pharmacy       Pharmacy
}

type ShippingMethod struct {
	Id          int64
	Name        *string
	Price       *int
	Type        string
	Description *string
	Code        string
	Estimated   string
	Service     string
}
