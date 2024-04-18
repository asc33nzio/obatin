package entity

type ProductList struct {
	Id          int64
	Name        string
	Slug        string
	SellingUnit string
	MinPrice    int
	MaxPrice    int
	ImageUrl    string
}

type ProductListPage struct {
	Products   []ProductList
	TotalRows  int
	Pagination PaginationResponse
}

type ProductFilter struct {
	Search         string
	Category       string
	SortBy         *string
	Classification *string
	Order          *string
	Page           int
	Limit          int
}
