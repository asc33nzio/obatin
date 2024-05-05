package entity

type PrescriptionItem struct {
	Id           int64
	Prescription Prescription
	Product      ProductDetail
	Amount       int
}
