package entity

import "mime/multipart"

type Authentication struct {
	Id               int64
	Email            string
	Password         string
	Token            string
	IsVerified       bool
	IsApproved       bool
	Role             string
	Certificate      multipart.File
	ConfirmPassword  string
	SpecializationID int64
	IsOnline         bool
}

type Pagination struct {
	Page  int
	Limit int
}

type UpdatePassword struct {
	OldPassword string
	NewPassword string
}
