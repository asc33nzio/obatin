package entity

import "time"

type StockMovement struct {
	Id              int64
	PharmacyProduct PharmacyProduct
	Delta           int
	IsAddition      bool
	MovementType    string
	CreatedAt       string
	UpdatedAt       time.Time
	DeletedAt       *time.Time
}

type StockMovementPagination struct {
	StockMovements []*StockMovement
	TotalRows      int
	Pagination     PaginationResponse
}

type StockMovementFilter struct {
	ProductId  *int64
	PharmacyId *int64
	PartnerId  *int64
	Page       int
	Limit      int
}
