package entity

type Payment struct {
	Id              int64
	User            User
	PaymentMethod   string
	TotalPayment    int
	PaymentProofUrl string
}
