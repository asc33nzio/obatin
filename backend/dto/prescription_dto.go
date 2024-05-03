package dto

import "obatin/entity"

type CreatePrescriptionReq struct {
	UserId int64                       `json:"user_id" binding:"required,gte=1"`
	Items  []CreatePrescriptionItemReq `json:"items" binding:"required,dive,required"`
}

func (p CreatePrescriptionReq) ToCreatePrescription() *entity.CreatePrescription {
	prescriptionItems := []entity.PrescriptionItem{}

	for _, pi := range p.Items {
		prescriptionItems = append(prescriptionItems, entity.PrescriptionItem{
			Product: entity.ProductDetail{Id: pi.ProductId},
			Amount:  pi.Amount,
		})
	}

	return &entity.CreatePrescription{
		UserId: p.UserId,
		Items:  prescriptionItems,
	}
}
