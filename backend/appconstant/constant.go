package appconstant

const (
	DefaultProductLimit                     = 10
	DefaultMinPage                          = 1
	DefaultMinLimit                         = 1
	MaxLevelWithChild                       = 2
	CategoryLevel1Int                       = 1
	CategoryLevel2Int                       = 2
	CategoryLevel3Int                       = 3
	DefaultPartnerLimit                     = 10
	DefaultDoctorLimit                      = 10
	DoctorOnlineTrue                        = true
	RFC3339TimeFormat                       = "2006-01-02"
	ContentTypeKey                          = "Content-Type"
	KeyKey                                  = "key"
	OriginKey                               = "origin"
	DestinationKey                          = "destination"
	WeightKey                               = "weight"
	CourierKey                              = "courier"
	ApplicationForm                         = "application/x-www-form-urlencoded"
	RajaOngkirJne                           = "jne"
	RajaOngkirTiki                          = "tiki"
	RajaOngkirPos                           = "pos"
	OfficialShippingMethod                  = "official"
	InternalStockMovementType               = "internal_mutation"
	SaleStockMovementType                   = "sale"
	ManualAditionStockMovementType          = "manual_addition"
	DefaultPaymentMethod                    = "transfer"
	InactvateCartBool                       = false
	PaymentWaitingConfirmation              = "waiting_confirmation"
	PaymentProcessed                        = "processed"
	InvoicePrefix                           = "INVOBTN"
	OrderWaitingConfirmation                = "waiting_confirmation"
	OrderProcessed                          = "processed"
	OrderWaitingPayment                     = "waiting_payment"
	OrderCancel                             = "cancelled"
	UpdatePharmacyProductTypeStockMutation  = "stock_mutation"
	UpdatePharmacyProductTypeManualMutation = "manual_addition"
	UpdatePharmacyProductTypeDetail         = "detail"
)
