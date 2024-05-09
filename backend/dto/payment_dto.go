package dto

type PaymentIdUriParams struct {
	Id int64 `uri:"id" binding:"required,gte=1"`
}

type PaymentProofConfirmationReq struct {
	PaymentId   int64 `json:"payment_id" binding:"required,gte=1"`
	UserId      int64 `json:"user_id" binding:"required,gte=1"`
	IsConfirmed *bool `json:"is_confirmed" binding:"required"`
}
