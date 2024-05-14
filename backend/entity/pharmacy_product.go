package entity

type PharmacyProduct struct {
	Id         int64
	Product    ProductDetail
	Pharmacy   Pharmacy
	Price      *int
	Stock      *int
	TotalStock int
	IsActive   bool
	Sales      int64
}

type PharmacyProductFilter struct {
	Search         string
	SearchPharmacy string
	ProductId      *int64
	PharmacyId     int64
	SortBy         *string
	Classification *string
	Order          *string
	Page           int
	Limit          int
}

type UpdatePharmacyProduct struct {
	UpdateType              string
	Price                   *int
	Stock                   *int
	Delta                   *int
	IsActive                *bool
	SourcePharmacyProductId *int64
	TargetPharmacyProductId *int64
	IsAddition              *bool
}

type PharmacyProductListPage struct {
	Products   []PharmacyProduct
	TotalRows  int
	Pagination PaginationResponse
}
