package entity

type City struct {
	Id         *int64
	Name       *string
	PostalCode *string
	Type       *string
	Province   Province
}
