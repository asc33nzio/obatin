package entity

import (
	"mime/multipart"
	"time"
)

type User struct {
	Id             *int64
	Name           *string
	Avatar         *string
	Authentication Authentication
	BirthDate      *time.Time
	Gender         *string
	ActiveAddress  Address
	Addresses      []Address
}

type UpdateUser struct {
	Name             *string
	AvatarImage      multipart.File
	BirthDate        *time.Time
	Gender           *string
	AuthenticationId int64
	AvatarUrl        *string
	ActiveAddressId  *int64
}

type UserListPage struct {
	Users      []User
	TotalRows  int
	Pagination PaginationResponse
}

type UserFilter struct {
	Search    string
	
}