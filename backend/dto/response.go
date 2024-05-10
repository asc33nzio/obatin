package dto

import (
	"obatin/appconstant"
	"obatin/entity"
)

type APIResponse struct {
	Message    string              `json:"message"`
	Pagination *PaginationResponse `json:"pagination,omitempty"`
	Data       any                 `json:"data,omitempty"`
}

type PaginationResponse struct {
	Page         int   `json:"page"`
	PageCount    int64 `json:"page_count"`
	TotalRecords int64 `json:"total_records"`
	Limit        int   `json:"limit"`
}

type UserAccessToken struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token,omitempty"`
}

type UserRegisterRes struct {
	Email string `json:"email"`
}

type UserVerifiedRes struct {
	Email string `json:"email"`
}

type CloudinaryUrlRes struct {
	FileUrl  string `json:"file_url,omitempty"`
	ImageUrl string `json:"image_url,omitempty"`
}

func ToUserRegisterRes(u entity.Authentication) UserRegisterRes {
	return UserRegisterRes{
		Email: u.Email,
	}
}

func ToVerifyRegisterRes(u entity.Authentication) UserVerifiedRes {
	return UserVerifiedRes{
		Email: u.Email,
	}
}

type UserDetailRes struct {
	Id               int64  `json:"id"`
	Name             string `json:"name"`
	Avatar           string `json:"avatar_url"`
	AuthenticationID int64  `json:"authentication_id"`
	Birth            string `json:"birth_date"`
	Gender           string `json:"gender"`
}

func ToUserDetailRes(u *entity.User) UserDetailRes {
	return UserDetailRes{
		Id:               *u.Id,
		Name:             *u.Name,
		Avatar:           *u.Avatar,
		AuthenticationID: u.Authentication.Id,
		Birth:            u.BirthDate.Format(appconstant.RFC3339TimeFormat),
		Gender:           *u.Gender,
	}
}

type MediaDto struct {
	StatusCode int                    `json:"statusCode"`
	Message    string                 `json:"message"`
	Data       map[string]interface{} `json:"data"`
}

type OneDoctorSpecializationRes struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Slug        string `json:"slug"`
}

func ToGetAllSpecializationsRes(specializations []entity.DoctorSpecialization) []OneDoctorSpecializationRes {
	res := []OneDoctorSpecializationRes{}

	for _, ds := range specializations {
		res = append(res, OneDoctorSpecializationRes{
			Id:          ds.Id,
			Name:        ds.Name,
			ImageURL:    ds.ImageURL,
			Description: ds.Description,
			Slug:        ds.Slug,
		})
	}

	return res
}

type OneDoctorPendingApprovalRes struct {
	AuthenticationID          int    `json:"authentication_id"`
	Email                     string `json:"email"`
	Certificate               string `json:"ceritificate_url"`
	SpecializationName        string `json:"specialization_name"`
	SpecializationDescription string `json:"specialization_description"`
}

func ToGetAllDoctorPendingApprovalRes(pendingApprovals []entity.Doctor) []OneDoctorPendingApprovalRes {
	res := []OneDoctorPendingApprovalRes{}

	for _, pa := range pendingApprovals {
		res = append(res, OneDoctorPendingApprovalRes{
			AuthenticationID:          int(pa.AuthenticationID),
			Email:                     pa.Email,
			Certificate:               pa.Certificate,
			SpecializationName:        pa.SpecializationName,
			SpecializationDescription: pa.SpecializationDescription,
		})
	}

	return res
}

type OneMessageRes struct {
	Id        int64  `json:"id"`
	Message   string `json:"message"`
	CreatedAt string `json:"created_at"`
	Sender    string `json:"sender"`
}

func ToGetAllMessageInChatRoom(messages []entity.Message) []OneMessageRes {
	res := []OneMessageRes{}

	for _, ds := range messages {
		res = append(res, OneMessageRes{
			Id:        ds.Id,
			Message:   ds.Message,
			CreatedAt: ds.CreatedAt,
			Sender:    ds.Sender,
		})
	}

	return res
}

type OneChatRoomRes struct {
	Id                  int64   `json:"chat_room_id"`
	UserId              int64   `json:"user_id"`
	DoctorId            int64   `json:"doctor_id,omitempty"`
	DoctorName          string  `json:"doctor_name,omitempty"`
	UserName            string  `json:"user_name,omitempty"`
	LastMessage         *string `json:"last_message,omitempty"`
	DoctorAvatar        string  `json:"avatar_url_doctor,omitempty"`
	UserAvatar          string  `json:"avatar_url_user,omitempty"`
	DoctorSpcialization string  `json:"doctor_specialization,omitempty"`
	IsActive            bool    `json:"is_active"`
}

func ToGetAllChatRoomRes(chatRooms []entity.ChatRoom) []OneChatRoomRes {
	res := []OneChatRoomRes{}

	for _, pa := range chatRooms {
		res = append(res, OneChatRoomRes{
			Id:                  pa.Id,
			UserId:              pa.UserId,
			DoctorId:            pa.DoctorId,
			DoctorName:          pa.DoctorName,
			UserName:            pa.UserName,
			LastMessage:         pa.LastMessage,
			DoctorAvatar:        pa.AvatarDoctor,
			UserAvatar:          pa.AvatarUser,
			DoctorSpcialization: pa.DoctorSpecialization,
			IsActive:            pa.IsActive,
		})
	}

	return res
}

type OneChatRoom struct {
	Id             int64                `json:"chat_room_id"`
	IsDoctorTyping bool                 `json:"is_doctor_typing"`
	IsUserTyping   bool                 `json:"is_user_typing"`
	Message        []OneMessageRes      `json:"message"`
	Doctor         DoctorDetailResponse `json:"doctor,omitempty"`
	User           UserDetailRes        `json:"user,omitempty"`
}
