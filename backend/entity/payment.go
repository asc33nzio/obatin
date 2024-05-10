package entity

import (
	"mime/multipart"
)

type Payment struct {
	Id               int64
	User             User
	PaymentMethod    string
	TotalPayment     int
	PaymentProofUrl  *string
	IsConfirmed      *bool
	PaymentProofFile multipart.File
	InvoiceNumber    string
	CreatedAt        string
	ExpiredAt        string
}

type PaymentFilter struct {
	Page  int
	Limit int
}

type PaymentsPagination struct {
	Payments   []*Payment
	TotalRows  int64
	Pagination PaginationResponse
}
