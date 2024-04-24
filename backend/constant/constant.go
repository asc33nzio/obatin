package constant

const (
	RoleDoctor                 = "doctor"
	RoleUser                   = "user"
	RoleAdmin                  = "admin"
	HasApproved                = true
	HasNotApproved             = false
	CertificateJSONTag         = "certificate"
	SpecializationIdJSONTag    = "doctor_specialization_id"
	EmailJSONTag               = "email"
	TokenQueryParam            = "token"
	ApproveQueryParam          = "approve"
	AuthenticationIDParam      = "authentication_id"
	HeaderBearerToken          = "Authorization"
	PrefixBearerToken          = "Bearer"
	MaximumSizeFileUploaded    = 1000000
	EmailTypeApprove           = "approved"
	EmailTypeRejected          = "rejected"
	EmailTypePasswordTemporary = "temporary"
	EmailForgotPassword        = "forgot"
	ErrorTokenIsExpired        = "token is expired"
)
