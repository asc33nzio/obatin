package dto

type CreatePrescriptionItemReq struct {
	ProductId int64 `json:"product_id" binding:"required,gte=1"`
	Amount    int   `json:"amount" binding:"required,gte=1"`
}
