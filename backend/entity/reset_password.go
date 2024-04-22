package entity

type ResetPassword struct {
	Id    int64
	Email string
	Token string
}
