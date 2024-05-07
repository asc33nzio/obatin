package dto

import (
	"obatin/appconstant"
	"obatin/entity"
	"time"
)

type CreatePrescriptionReq struct {
	UserId int64                       `json:"user_id" binding:"required,gte=1"`
	Items  []CreatePrescriptionItemReq `json:"items" binding:"required,dive,required"`
}

type CreatePrescriptionRes struct {
	PrescriptionId int64 `json:"id"`
}

type UserPrescriptionRes struct {
	Id                     int64     `json:"id"`
	UserId                 int64     `json:"user_id"`
	DoctorId               int64     `json:"doctor_id"`
	IsRedeemed             bool      `json:"is_redeemed"`
	DoctorName             string    `json:"doctor_name"`
	DoctorSpecializationId int64     `json:"doctor_specializaiton_id"`
	DoctorSpecialization   string    `json:"doctor_specialization"`
	IsDoctorOnline         bool      `json:"is_doctor_online"`
	CreatedAt              time.Time `json:"created_at"`
}

type DoctorPrescriptionRes struct {
	Id            int64     `json:"id"`
	UserId        int64     `json:"user_id"`
	DoctorId      int64     `json:"doctor_id"`
	IsRedeemed    bool      `json:"is_redeemed"`
	UserName      string    `json:"user_name"`
	UserBirthDate string    `json:"user_birth_date"`
	UserGender    string    `json:"user_gender"`
	CreatedAt     time.Time `json:"created_at"`
}

type PrescriptionIdUriParam struct {
	Id int64 `uri:"id"`
}

type PrescriptionDetailsRes struct {
	PrescriptionId         int64
	DoctorId               int64                  `json:"doctor_id"`
	DoctorName             string                 `json:"doctor_name"`
	DoctorSpecializationId int64                  `json:"doctor_specializaiton_id"`
	DoctorSpecialization   string                 `json:"doctor_specialization"`
	IsDoctorOnline         bool                   `json:"is_doctor_online"`
	UserId                 int64                  `json:"user_id"`
	UserName               string                 `json:"user_name"`
	UserBirthDate          string                 `json:"user_birth_date"`
	UserGender             string                 `json:"user_gender"`
	CreatedAt              time.Time              `json:"created_at"`
	Items                  []*PrescriptionItemRes `json:"items"`
}

type PrescriptionItemRes struct {
	Id                    int64  `json:"id"`
	ProductId             int64  `json:"product_id"`
	ProductName           string `json:"product_name"`
	ProductSlug           string `json:"product_slug"`
	ProductImageUrl       string `json:"product_image_url"`
	ProductThumbnailUrl   string `json:"product_thumbnail_url"`
	ProductClassification string `json:"product_classification"`
	ProductSellingUnit    string `json:"product_selling_unit"`
	Quantity              int    `json:"quantity"`
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

func ToGetAllUserPrescriptionRes(prescriptions []*entity.Prescription) []UserPrescriptionRes {
	res := []UserPrescriptionRes{}

	for _, p := range prescriptions {
		res = append(res, UserPrescriptionRes{
			Id:                     p.Id,
			UserId:                 *p.User.Id,
			DoctorId:               p.Doctor.Id,
			IsRedeemed:             p.IsRedeemed,
			DoctorName:             p.Doctor.Name,
			DoctorSpecializationId: p.Doctor.Specialization,
			DoctorSpecialization:   p.Doctor.SpecializationName,
			IsDoctorOnline:         p.Doctor.IsOnline,
			CreatedAt:              p.CreatedAt,
		})
	}

	return res
}

func ToGetAllDoctorPrescriptionRes(prescriptions []*entity.Prescription) []DoctorPrescriptionRes {
	res := []DoctorPrescriptionRes{}

	for _, p := range prescriptions {
		res = append(res, DoctorPrescriptionRes{
			Id:            p.Id,
			UserId:        *p.User.Id,
			DoctorId:      p.Doctor.Id,
			IsRedeemed:    p.IsRedeemed,
			UserName:      *p.User.Name,
			UserBirthDate: p.User.BirthDate.Format(appconstant.RFC3339TimeFormat),
			UserGender:    *p.User.Gender,
			CreatedAt:     p.CreatedAt,
		})
	}

	return res
}

func ToGetPrescriptionDetailsRes(prescriptionItems []*entity.PrescriptionItem) PrescriptionDetailsRes {
	res := PrescriptionDetailsRes{}
	itemsRes := []*PrescriptionItemRes{}

	if len(prescriptionItems) == 0 {
		return res
	}

	res.PrescriptionId = prescriptionItems[0].Prescription.Id
	res.DoctorId = prescriptionItems[0].Prescription.Doctor.Id
	res.DoctorName = prescriptionItems[0].Prescription.Doctor.Name
	res.DoctorSpecialization = prescriptionItems[0].Prescription.Doctor.SpecializationName
	res.DoctorSpecializationId = prescriptionItems[0].Prescription.Doctor.Specialization
	res.IsDoctorOnline = prescriptionItems[0].Prescription.Doctor.IsOnline
	res.UserId = *prescriptionItems[0].Prescription.User.Id
	res.UserName = *prescriptionItems[0].Prescription.User.Name
	res.UserBirthDate = prescriptionItems[0].Prescription.User.BirthDate.Format(appconstant.RFC3339TimeFormat)
	res.UserGender = *prescriptionItems[0].Prescription.User.Gender
	res.CreatedAt = prescriptionItems[0].Prescription.CreatedAt

	for _, pi := range prescriptionItems {
		itemsRes = append(itemsRes, &PrescriptionItemRes{
			Id:                    pi.Id,
			ProductId:             pi.Product.Id,
			Quantity:              pi.Amount,
			ProductName:           pi.Product.Name,
			ProductSlug:           pi.Product.Slug,
			ProductImageUrl:       pi.Product.ImageUrl,
			ProductThumbnailUrl:   pi.Product.ThumbnailUrl,
			ProductClassification: pi.Product.Classification,
			ProductSellingUnit:    pi.Product.SellingUnit,
		})
	}

	res.Items = itemsRes
	return res
}
