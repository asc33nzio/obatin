package dto

type GetAuthenticationRes struct {
	Id         int64  `json:"id"`
	Email      string `json:"email"`
	IsVerified bool   `json:"is_verified"`
	IsApproved bool   `json:"is_approved"`
}
