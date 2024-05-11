package dto

import "obatin/entity"

type PaymentIdUriParams struct {
	Id int64 `uri:"id" binding:"required,gte=1"`
}

type PaymentProofConfirmationReq struct {
	PaymentId   int64 `json:"payment_id" binding:"required,gte=1"`
	UserId      int64 `json:"user_id" binding:"required,gte=1"`
	IsConfirmed *bool `json:"is_confirmed" binding:"required"`
}

type PaymentFilter struct {
	Page  int `form:"page" binding:"omitempty,min=1"`
	Limit int `form:"limit" binding:"omitempty,min=1,max=25"`
}

type PaymentRes struct {
	Id              int64  `json:"id"`
	InvoiceNumber   string `json:"invoice_number"`
	UserId          int64  `json:"user_id"`
	PaymentMethod   string `json:"payment_method"`
	TotalPayment    int    `json:"total_payment"`
	PaymentProofUrl string `json:"payment_proof_url"`
	IsConfirmed     bool   `json:"is_confirmed"`
	CreatedAt       string `json:"created_at"`
}

func (p PaymentFilter) ToPaymentFilterEntity() *entity.PaymentFilter {
	return &entity.PaymentFilter{
		Page:  p.Page,
		Limit: p.Limit,
	}
}

func ToGetAllPendingPayments(payments []*entity.Payment) []PaymentRes {
	res := []PaymentRes{}

	for _, p := range payments {
		var paymentProof string
		if p.PaymentProofUrl != nil {
			paymentProof = *p.PaymentProofUrl
		}
		res = append(res, PaymentRes{
			Id:              p.Id,
			InvoiceNumber:   p.InvoiceNumber,
			UserId:          *p.User.Id,
			PaymentMethod:   p.PaymentMethod,
			TotalPayment:    p.TotalPayment,
			PaymentProofUrl: paymentProof,
			IsConfirmed:     *p.IsConfirmed,
			CreatedAt:       p.CreatedAt,
		})
	}

	return res
}
