package entity

import "time"

type Prescription struct {
	Id         int64
	User       User
	Doctor     Doctor
	IsRedeemed bool
	CreatedAt  time.Time
}

type CreatePrescription struct {
	Id       int64
	UserId   int64
	DoctorId int64
	Items    []PrescriptionItem
}
