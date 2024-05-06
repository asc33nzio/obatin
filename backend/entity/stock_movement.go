package entity

import "time"

type StockMovement struct {
	Id              int64
	PharmacyProduct PharmacyProduct
	Delta           int
	IsAddition      bool
	MovementType    string
	CreatedAt       time.Time
	UpdatedAt       time.Time
	DeletedAt       *time.Time
}
