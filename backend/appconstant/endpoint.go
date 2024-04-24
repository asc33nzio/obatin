package appconstant

const (
	EndpointPing                     = "/ping"
	EndpointLogin                    = "/auth/login"
	EndpointRegisterDoctor           = "/auth/register/doctors"
	EndpointRegisterUser             = "/auth/register/users"
	EndpointVerify                   = "/auth/verify"
	EndpointSendVerifyToEmail        = "/auth/verify/mail"
	EndpointGetProductsList          = "/shop/products"
	EndpointUpdatePassword           = "/auth/update-password"
	EndpointApproval                 = "/approve/:authentication_id"
	EndpointForgotPassword           = "/auth/forgot-password"
	EndpointGetDoctorSpecialization  = "/doctor-specializations"
	EndpointGetDoctorPendingApproval = "/doctor-pending-approval"
	EndpointGetProductDetail         = "/shop/products/:product_slug"
	EndpointRefreshToken             = "/auth/refresh-token"
)
