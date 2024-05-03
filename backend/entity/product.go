package entity

import "github.com/shopspring/decimal"

type ProductList struct {
	Id          int64
	Name        string
	Slug        string
	SellingUnit string
	MinPrice    int
	MaxPrice    int
	ImageUrl    string
	IsPrescriptionRequired bool
}

type ProductDetail struct {
	Id                     int64
	Name                   string
	MinPrice               int
	MaxPrice               int
	Slug                   string
	GenericName            string
	GeneralIndication      string
	Dosage                 string
	HowToUse               string
	SideEffects            string
	Contraindication       string
	Warning                string
	BpomNumber             string
	Content                string
	Description            string
	Classification         string
	Packaging              string
	SellingUnit            string
	Form                   string
	Weight                 decimal.Decimal
	Height                 decimal.Decimal
	Length                 decimal.Decimal
	Width                  decimal.Decimal
	ImageUrl               string
	ThumbnailUrl           string
	IsActive               bool
	IsPrescriptionRequired bool
	Manufacturer           Manufacturer
}

type Manufacturer struct {
	ID   int64
	Name string
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
