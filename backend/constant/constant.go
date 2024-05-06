package constant

const (
	RoleDoctor                 = "doctor"
	RoleUser                   = "user"
	RoleAdmin                  = "admin"
	RoleManager                = "manager"
	HasApproved                = true
	HasNotApproved             = false
	CertificateJSONTag         = "certificate"
	SpecializationIdJSONTag    = "doctor_specialization_id"
	ImageUrlFormKey            = "image"
	AvatarURLFormKey           = "avatar"
	EmailJSONTag               = "email"
	TokenQueryParam            = "token"
	IsExtendedQueryParam       = "extend"
	ApproveQueryParam          = "approve"
	AuthenticationIDParam      = "authentication_id"
	HeaderBearerToken          = "Authorization"
	PrefixBearerToken          = "Bearer"
	MaximumSizeFileUploaded    = 1000000
	MaximumSizeImageUploaded   = 500000
	EmailTypeApprove           = "approved"
	EmailTypeRejected          = "rejected"
	EmailTypePasswordTemporary = "temporary"
	EmailForgotPassword        = "forgot"
	EmailReverifyAccount       = "reverify"
	AvatarImageFormKey         = "avatar"
	ErrorTokenIsExpired        = "token is expired"
	HasVerified                = true
	LogoJSONTag                = "logo"
	PasswordJSONTag            = "password"
	NameJSONTag                = "name"
	RegexLowerCase             = "[a-z]"
	RegexUpperCase             = "[A-Z]"
	RegexDigitCase             = "[0-9]"
	IsOnline                   = true
	IsNotOnline                = false
	IsAccepted                 = true
	IsNotAccepted              = false
	IsReverified               = true
	IsNotReverified            = false
	IsForgotPassword           = true
	IsNotForgotPassword        = false
)
