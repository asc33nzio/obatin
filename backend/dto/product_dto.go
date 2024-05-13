package dto

import (
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/entity"
	"strconv"
	"strings"

	"github.com/shopspring/decimal"
)

type ProductFilter struct {
	Search         string  `form:"search"`
	Category       string  `form:"category"`
	SortBy         *string `form:"sort_by" binding:"omitempty,oneof='name' 'price' 'sales'"`
	Classification *string `form:"classification" binding:"omitempty,oneof='obat_bebas' 'obat_bebas_terbatas' 'non_obat' 'obat_keras'"`
	Order          *string `form:"order" binding:"omitempty,oneof='asc' 'desc'"`
	Page           int     `form:"page" binding:"omitempty,min=1"`
	Limit          int     `form:"limit" binding:"omitempty,min=1,max=25"`
}

type ProductSlugParam struct {
	Slug string `uri:"product_slug" binding:"required"`
}

type ProductIdUriParam struct {
	Id int64 `uri:"id" binding:"required"`
}

type AddProductRequest struct {
	ManufacturerId         int64           `form:"manufacturer_id" binding:"required,gte=1"`
	Name                   string          `form:"name" binding:"required"`
	MinPrice               int             `form:"min_price" binding:"required"`
	MaxPrice               int             `form:"max_price" binding:"required"`
	Slug                   string          `form:"product_slug" binding:"required"`
	GenericName            string          `form:"generic_name" binding:"required"`
	GeneralIndication      string          `form:"general_indication" binding:"omitempty"`
	Dosage                 string          `form:"dosage" binding:"omitempty"`
	HowToUse               string          `form:"how_to_use" binding:"omitempty"`
	SideEffects            string          `form:"side_effects" binding:"omitempty"`
	Contraindication       string          `form:"contraindication" binding:"omitempty"`
	Warning                string          `form:"warning" binding:"omitempty"`
	BpomNumber             string          `form:"bpom_number" binding:"omitempty"`
	Content                string          `form:"content" binding:"omitempty"`
	Description            string          `form:"description" binding:"omitempty"`
	Classification         string          `form:"classification" binding:"required,oneof='obat_bebas' 'obat_bebas_terbatas' 'non_obat' 'obat_keras'"`
	Packaging              string          `form:"packaging" binding:"omitempty"`
	SellingUnit            string          `form:"selling_unit" binding:"omitempty"`
	Weight                 decimal.Decimal `form:"weight" binding:"required"`
	Height                 decimal.Decimal `form:"height" binding:"omitempty"`
	Length                 decimal.Decimal `form:"length" binding:"omitempty"`
	Width                  decimal.Decimal `form:"width" binding:"omitempty"`
	ImageUrl               *string         `form:"image_url"`
	ThumbnailUrl           *string         `form:"thumbnail_url"`
	IsActive               *bool           `form:"is_active" binding:"required"`
	IsPrescriptionRequired *bool           `form:"is_prescription_required" binding:"required"`
	Categories             string          `form:"categories" binding:"required"`
}

type UpdateProductRequest struct {
	ManufacturerId         *int64           `form:"manufacturer_id"`
	Name                   *string          `form:"name"`
	MinPrice               *int             `form:"min_price"`
	MaxPrice               *int             `form:"max_price"`
	Slug                   *string          `form:"product_slug"`
	GenericName            *string          `form:"generic_name"`
	GeneralIndication      *string          `form:"general_indication"`
	Dosage                 *string          `form:"dosage"`
	HowToUse               *string          `form:"how_to_use"`
	SideEffects            *string          `form:"side_effects"`
	Contraindication       *string          `form:"contraindication"`
	Warning                *string          `form:"warning"`
	BpomNumber             *string          `form:"bpom_number"`
	Content                *string          `form:"content"`
	Description            *string          `form:"description"`
	Classification         *string          `form:"classification" binding:"omitempty,oneof='obat_bebas' 'obat_bebas_terbatas' 'non_obat' 'obat_keras'"`
	Packaging              *string          `form:"packaging"`
	SellingUnit            *string          `form:"selling_unit"`
	Weight                 *decimal.Decimal `form:"weight"`
	Height                 *decimal.Decimal `form:"height"`
	Length                 *decimal.Decimal `form:"length"`
	Width                  *decimal.Decimal `form:"width"`
	ImageUrl               *string          `form:"image_url"`
	ThumbnailUrl           *string          `form:"thumbnail_url"`
	IsActive               *bool            `form:"is_active"`
	IsPrescriptionRequired *bool            `form:"is_prescription_required"`
	Categories             *string          `form:"categories"`
}

type ProductDetailResponse struct {
	Id                     int64                  `json:"id"`
	Name                   string                 `json:"name"`
	MinPrice               int                    `json:"min_price"`
	MaxPrice               int                    `json:"max_price"`
	Slug                   string                 `json:"product_slug"`
	GenericName            string                 `json:"generic_name"`
	GeneralIndication      string                 `json:"general_indication"`
	Dosage                 string                 `json:"dosage"`
	HowToUse               string                 `json:"how_to_use"`
	SideEffects            string                 `json:"side_effects"`
	Contraindication       string                 `json:"contraindication"`
	Warning                string                 `json:"warning"`
	BpomNumber             string                 `json:"bpom_number"`
	Content                string                 `json:"content"`
	Description            string                 `json:"description"`
	Classification         string                 `json:"classification"`
	Packaging              string                 `json:"packaging"`
	SellingUnit            string                 `json:"selling_unit"`
	Weight                 decimal.Decimal        `json:"weight"`
	Height                 decimal.Decimal        `json:"height"`
	Length                 decimal.Decimal        `json:"length"`
	Width                  decimal.Decimal        `json:"width"`
	ImageUrl               string                 `json:"image_url"`
	ThumbnailUrl           string                 `json:"thumbnail_url"`
	IsActive               bool                   `json:"is_active"`
	IsPrescriptionRequired bool                   `json:"is_prescription_required"`
	Manufacturer           ManufacturerResponse   `json:"manufacturer"`
	Categories             []CategoryResponse     `json:"categories"`
	Sales                  []MonthlySalesResponse `json:"sales,omitempty"`
}

type ProductListResponse struct {
	Id                     int64  `json:"id"`
	Name                   string `json:"name"`
	Slug                   string `json:"product_slug"`
	SellingUnit            string `json:"selling_unit"`
	MinPrice               int    `json:"min_price"`
	MaxPrice               int    `json:"max_price"`
	ImageUrl               string `json:"image_url"`
	IsPrescriptionRequired bool   `json:"is_prescription_required"`
	Sales                  int    `json:"sales,omitempty"`
}

type ProductListPageResponse struct {
	Pagination *PaginationResponse   `json:"pagination,omitempty"`
	Data       []ProductListResponse `json:"data"`
}

type MonthlySalesResponse struct {
	Month      string `json:"month"`
	TotalSales int    `json:"total_sales"`
}

func (p ProductFilter) ToProductFilterEntity() entity.ProductFilter {
	return entity.ProductFilter{
		Search:         p.Search,
		Category:       p.Category,
		SortBy:         p.SortBy,
		Classification: p.Classification,
		Order:          p.Order,
		Page:           p.Page,
		Limit:          p.Limit,
	}
}

func ToProductDetailResponse(product *entity.ProductDetail, forSales bool) ProductDetailResponse {
	var categories []CategoryResponse
	monthRes := []MonthlySalesResponse{}

	for _, values := range product.Categories {
		category := CategoryResponse{
			Id:       values.Id,
			Name:     values.Name,
			Slug:     values.Slug,
			ImageUrl: values.ImageUrl,
			ParentId: values.ParentId,
			HasChild: values.HasChild,
			Level:    values.Level,
		}
		categories = append(categories, category)
	}
	if forSales {
		for _, v := range appconstant.MonthSlice {
			monthRes = append(monthRes, MonthlySalesResponse{
				Month: v,
			})
		}
		if product.Sales.January != nil {
			monthRes[0].TotalSales = *product.Sales.January
		}
		if product.Sales.February != nil {
			monthRes[1].TotalSales = *product.Sales.February
		}
		if product.Sales.March != nil {
			monthRes[2].TotalSales = *product.Sales.March
		}
		if product.Sales.April != nil {
			monthRes[3].TotalSales = *product.Sales.April
		}
		if product.Sales.May != nil {
			monthRes[4].TotalSales = *product.Sales.May
		}
		if product.Sales.June != nil {
			monthRes[5].TotalSales = *product.Sales.June
		}
		if product.Sales.July != nil {
			monthRes[6].TotalSales = *product.Sales.July
		}
		if product.Sales.August != nil {
			monthRes[7].TotalSales = *product.Sales.August
		}
		if product.Sales.September != nil {
			monthRes[8].TotalSales = *product.Sales.September
		}
		if product.Sales.October != nil {
			monthRes[9].TotalSales = *product.Sales.October
		}
		if product.Sales.November != nil {
			monthRes[10].TotalSales = *product.Sales.November
		}
		if product.Sales.December != nil {
			monthRes[11].TotalSales = *product.Sales.December
		}

	}

	return ProductDetailResponse{
		Id:                     product.Id,
		Name:                   product.Name,
		MinPrice:               product.MinPrice,
		MaxPrice:               product.MaxPrice,
		Slug:                   product.Slug,
		GenericName:            product.GenericName,
		GeneralIndication:      product.GeneralIndication,
		Dosage:                 product.Dosage,
		HowToUse:               product.HowToUse,
		SideEffects:            product.SideEffects,
		Contraindication:       product.Contraindication,
		Warning:                product.Warning,
		BpomNumber:             product.BpomNumber,
		Content:                product.Content,
		Description:            product.Description,
		Classification:         product.Classification,
		Packaging:              product.Packaging,
		SellingUnit:            product.SellingUnit,
		Weight:                 product.Weight,
		Height:                 product.Height,
		Length:                 product.Length,
		Width:                  product.Width,
		ImageUrl:               product.ImageUrl,
		ThumbnailUrl:           product.ThumbnailUrl,
		IsActive:               product.IsActive,
		IsPrescriptionRequired: product.IsPrescriptionRequired,
		Manufacturer: ManufacturerResponse{
			ID:   product.Manufacturer.ID,
			Name: product.Manufacturer.Name,
		},
		Categories: categories,
		Sales:      monthRes,
	}
}

func ToProductListResponse(products *entity.ProductListPage) []ProductListResponse {
	response := []ProductListResponse{}
	for _, values := range products.Products {
		response = append(response, ProductListResponse{
			Id:                     values.Id,
			Name:                   values.Name,
			Slug:                   values.Slug,
			SellingUnit:            values.SellingUnit,
			MinPrice:               values.MinPrice,
			MaxPrice:               values.MaxPrice,
			ImageUrl:               values.ImageUrl,
			IsPrescriptionRequired: values.IsPrescriptionRequired,
			Sales:                  values.Sales,
		})
	}
	return response
}

func ToProductDetailFromInsertBody(req AddProductRequest) (*entity.AddProduct, error) {
	var categories []int64
	categoryReqSilce := strings.Split(req.Categories, ",")
	for _, v := range categoryReqSilce {
		category, err := strconv.Atoi(v)
		if err != nil {
			return nil, apperror.ErrInvalidReq(apperror.ErrStlBadRequest)
		}
		categories = append(categories, int64(category))
	}

	res := entity.AddProduct{
		Product: entity.ProductDetail{
			Manufacturer: entity.Manufacturer{
				ID: req.ManufacturerId,
			},
			Name:                   req.Name,
			MinPrice:               req.MinPrice,
			MaxPrice:               req.MaxPrice,
			Slug:                   req.Slug,
			GenericName:            req.GenericName,
			GeneralIndication:      req.GeneralIndication,
			Dosage:                 req.Dosage,
			HowToUse:               req.HowToUse,
			SideEffects:            req.SideEffects,
			Contraindication:       req.Contraindication,
			Warning:                req.Warning,
			BpomNumber:             req.BpomNumber,
			Content:                req.Content,
			Description:            req.Description,
			Classification:         req.Classification,
			Packaging:              req.Packaging,
			SellingUnit:            req.SellingUnit,
			Weight:                 req.Weight,
			Height:                 req.Height,
			Length:                 req.Length,
			Width:                  req.Width,
			IsActive:               *req.IsActive,
			IsPrescriptionRequired: *req.IsPrescriptionRequired,
		},
		Categories: categories,
	}
	if req.ImageUrl != nil {
		res.Product.ImageUrl = *req.ImageUrl
		res.Product.ThumbnailUrl = *req.ImageUrl
	}
	if req.ThumbnailUrl != nil {
		res.Product.ThumbnailUrl = *req.ThumbnailUrl
	}

	return &res, nil
}

func ToEntityFromUpdateProductBody(req UpdateProductRequest) (*entity.UpdateProduct, error) {
	var categories []int64
	if req.Categories != nil {
		categoryReqSilce := strings.Split(*req.Categories, ",")
		for _, v := range categoryReqSilce {
			category, err := strconv.Atoi(v)
			if err != nil {
				return nil, apperror.ErrInvalidReq(apperror.ErrStlBadRequest)
			}
			categories = append(categories, int64(category))
		}
	}

	res := entity.UpdateProduct{
		Name:                   req.Name,
		MinPrice:               req.MinPrice,
		MaxPrice:               req.MaxPrice,
		Slug:                   req.Slug,
		GenericName:            req.GenericName,
		GeneralIndication:      req.GeneralIndication,
		Dosage:                 req.Dosage,
		HowToUse:               req.HowToUse,
		SideEffects:            req.SideEffects,
		Contraindication:       req.Contraindication,
		Warning:                req.Warning,
		BpomNumber:             req.BpomNumber,
		Content:                req.Content,
		Description:            req.Description,
		Classification:         req.Classification,
		Packaging:              req.Packaging,
		SellingUnit:            req.SellingUnit,
		Weight:                 req.Weight,
		Height:                 req.Height,
		Length:                 req.Length,
		Width:                  req.Width,
		IsActive:               req.IsActive,
		IsPrescriptionRequired: req.IsPrescriptionRequired,
		Categories:             &categories,
	}
	if req.ManufacturerId != nil {
		res.Manufacturer = &entity.Manufacturer{
			ID: *req.ManufacturerId,
		}
	}
	if req.ImageUrl != nil {
		res.ImageUrl = req.ImageUrl
		res.ThumbnailUrl = req.ImageUrl
	}
	if req.ThumbnailUrl != nil {
		res.ThumbnailUrl = req.ThumbnailUrl
	}

	return &res, nil
}
