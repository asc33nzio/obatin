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

type RefreshTokenReq struct {
	RefreshToken string `json:"refresh_token"`
}

type DoctorRegisterReq struct {
	Email            string `form:"email" binding:"required"`
	Password         string `form:"password"`
	Certificate      multipart.File
	SpecializationId int64 `form:"doctor_specialization_id" binding:"required"`
}

type PaginationReq struct {
	Page  int `form:"page" binding:"omitempty,min=1"`
	Limit int `form:"limit" binding:"omitempty,min=1,max=25"`
}

type UpdatePasswordReq struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	Token           string `json:"token"`
	ConfirmPassword string `json:"confirm_password"`
}

type UpdateProfilePasswordReq struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

type PartnerRegisterReq struct {
	Email    string `form:"email" binding:"required"`
	Password string `form:"password" binding:"required"`
	Logo     multipart.File
	Name     string `form:"name" binding:"required"`
}

type MessageReq struct {
	Message    string `json:"message" binding:"required"`
	ChatRoomId int64  `json:"chat_room_id" binding:"required"`
}

type ChatRoomReq struct {
	DoctorId int64 `json:"doctor_id" binding:"required"`
}

type UpdateIsTypingReq struct {
	ChatRoomId int64 `json:"chat_room_id" binding:"required"`
	UserId     int64 `json:"user_id,omitempty"`
	DoctorId   int64 `json:"doctor_id,omitempty"`
	IsTyping   *bool `json:"is_typing" binding:"required"`
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

func (u UpdateProfilePasswordReq) ToUpdatePassword() entity.UpdatePassword {
	return entity.UpdatePassword{
		OldPassword: u.OldPassword,
		NewPassword: u.NewPassword,
	}
}

func (u UpdatePasswordReq) ToEmail() entity.Authentication {
	return entity.Authentication{
		Email: u.Email,
	}
}

func (u PartnerRegisterReq) ToPartner() entity.Partner {
	return entity.Partner{
		Email:    u.Email,
		Password: u.Password,
		Logo:     u.Logo,
		Name:     u.Name,
	}
}

func (u MessageReq) ToMessage() entity.Message {
	return entity.Message{
		Message:    u.Message,
		ChatRoomId: u.ChatRoomId,
	}
}

func (u ChatRoomReq) ToChatRoom() entity.ChatRoom {
	return entity.ChatRoom{
		DoctorId: u.DoctorId,
	}
}

func (u UpdateIsTypingReq) ToUpdateIsTypingDoctor() entity.ChatRoom {
	return entity.ChatRoom{
		DoctorId:       u.DoctorId,
		UserId:         u.UserId,
		IsDoctorTyping: *u.IsTyping,
	}
}

func (u UpdateIsTypingReq) ToUpdateIsTypingUser() entity.ChatRoom {
	return entity.ChatRoom{
		DoctorId:     u.DoctorId,
		UserId:       u.UserId,
		IsUserTyping: *u.IsTyping,
	}
}

func (r PaginationReq) ToPaginationEntity() entity.Pagination {
	return entity.Pagination{
		Page:  r.Page,
		Limit: r.Limit,
	}
}
