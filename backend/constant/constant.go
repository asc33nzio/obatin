package constant

const (
	RoleDoctor                 = "doctor"
	RoleUser                   = "user"
	HasApproved                = true
	HasNotApproved             = false
	CertificateJSONTag         = "certificate"
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
)
