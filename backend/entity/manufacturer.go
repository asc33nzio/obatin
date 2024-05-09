package entity

type Manufacturer struct {
	ID   int64
	Name string
}

type ManufacturerFilter struct {
	Search string
	SortBy *string
	Order  *string
	Page   int
	Limit  int
}

type ManufacturerListPage struct {
	Manufacturers []Manufacturer
	TotalRows     int
	Pagination    PaginationResponse
}
