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
	Email            string         `form:"email" binding:"required"`
	Password         string         `form:"password"`
	Certificate      multipart.File 
	SpecializationId int64          `form:"doctor_specialization_id" binding:"required"`
}

type UpdatePasswordReq struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	Token           string `json:"token"`
	ConfirmPassword string `json:"confirm_password"`
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
		Email:            u.Email,
		Password:         u.Password,
		Certificate:      u.Certificate,
		SpecializationID: u.SpecializationId,
	}
}

func (u UpdatePasswordReq) ToPassword() entity.Authentication {
	return entity.Authentication{
		Password:        u.Password,
		ConfirmPassword: u.ConfirmPassword,
	}
}

func (u UpdatePasswordReq) ToEmail() entity.Authentication {
	return entity.Authentication{
		Email: u.Email,
	}
}
