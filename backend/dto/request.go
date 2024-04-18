package dto

import (
	"mime/multipart"
	"obatin/entity"
)

type UserLoginReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type UserRegisterReq struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type DoctorRegisterReq struct {
	Email       string         `json:"email" binding:"required"`
	Password    string         `json:"password"`
	Certificate multipart.File `json:"certificate" binding:"required"`
}

type UpdatePasswordReq struct {
	Password string `json:"password" binding:"required,min=8"`
	Token    string `json:"token"`
}

func (u UserLoginReq) ToUser() entity.Authentication {
	return entity.Authentication{
		Email:    u.Email,
		Password: u.Password,
	}
}

func (u UserRegisterReq) ToUser() entity.Authentication {
	return entity.Authentication{
		Email:    u.Email,
		Password: u.Password,
	}
}

func (u DoctorRegisterReq) ToDoctor() entity.Authentication {
	return entity.Authentication{
		Email:       u.Email,
		Password:    u.Password,
		Certificate: u.Certificate,
	}
}

func (u UpdatePasswordReq) ToPassword() entity.Authentication {
	return entity.Authentication{
		Password: u.Password,
	}
}
