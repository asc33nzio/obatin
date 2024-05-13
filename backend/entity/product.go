package entity

import (
	"mime/multipart"

	"github.com/shopspring/decimal"
)

type ProductList struct {
	Id                     int64
	Name                   string
	Slug                   string
	SellingUnit            string
	MinPrice               int
	MaxPrice               int
	ImageUrl               string
	IsPrescriptionRequired bool
	Sales                  int
	SearchPriority         int
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
	Weight                 decimal.Decimal
	Height                 decimal.Decimal
	Length                 decimal.Decimal
	Width                  decimal.Decimal
	ImageUrl               string
	ThumbnailUrl           string
	IsActive               bool
	IsPrescriptionRequired bool
	Manufacturer           Manufacturer
	Categories             []Category
	Sales                  MonthlySales
}

type UpdateProduct struct {
	Name                   *string
	MinPrice               *int
	MaxPrice               *int
	Slug                   *string
	GenericName            *string
	GeneralIndication      *string
	Dosage                 *string
	HowToUse               *string
	SideEffects            *string
	Contraindication       *string
	Warning                *string
	BpomNumber             *string
	Content                *string
	Description            *string
	Classification         *string
	Packaging              *string
	SellingUnit            *string
	Weight                 *decimal.Decimal
	Height                 *decimal.Decimal
	Length                 *decimal.Decimal
	Width                  *decimal.Decimal
	ImageUrl               *string
	ThumbnailUrl           *string
	IsActive               *bool
	IsPrescriptionRequired *bool
	Manufacturer           *Manufacturer
	Categories             *[]int64
	Image                  *multipart.File
}

type AddProduct struct {
	Product    ProductDetail
	Categories []int64
	Image      *multipart.File
}

type MonthlySales struct {
	January   *int
	February  *int
	March     *int
	April     *int
	May       *int
	June      *int
	July      *int
	August    *int
	September *int
	October   *int
	November  *int
	December  *int
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

type ProductCategory struct {
	Id         int64
	ProductId  int64
	CategoryId int64
}
