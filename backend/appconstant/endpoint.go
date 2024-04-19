package appconstant

const (
	EndpointPing              = "/ping"
	EndpointLogin             = "/auth/login"
	EndpointRegisterDoctor    = "/auth/register/doctors"
	EndpointRegisterUser      = "/auth/register/users"
	EndpointVerify            = "/auth/verify"
	EndpointSendVerifyToEmail = "/auth/verify/mail"
	EndpointGetProductsList   = "/shop/products"
	EndpointGetProductDetail = "/shop/products/:product_slug"
	EndpointUpdatePassword    = "/auth/update-password"
	EndpointApproval          = "/approve/:authentication_id"
)
