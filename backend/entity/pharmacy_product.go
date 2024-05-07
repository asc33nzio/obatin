package entity

type PharmacyProduct struct {
	Id         int64
	Product    ProductDetail
	Pharmacy   Pharmacy
	Price      *int
	Stock      *int
	TotalStock int
	IsActive   bool
}
