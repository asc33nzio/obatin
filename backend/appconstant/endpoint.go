package appconstant

const (
	EndpointPing                      = "/ping"
	EndpointLogin                     = "/auth/login"
	EndpointRegisterDoctor            = "/auth/register/doctors"
	EndpointRegisterUser              = "/auth/register/users"
	EndpointVerify                    = "/auth/verify"
	EndpointSendVerifyToEmail         = "/auth/verify/mail"
	EndpointGetProductsList           = "/shop/products"
	EndpointApproval                  = "/approve/:authentication_id"
	EndPointAllCategories             = "/shop/categories"
	EndpointUpdateCategory            = "/shop/categories/:category_slug"
	EndpointForgotPassword            = "/auth/forgot"
	EndpointResetPassword             = "/auth/reset"
	EndpointUpdatePassword            = "/auth/update"
	EndpointGetDoctorSpecialization   = "/doctor-specializations"
	EndpointGetDoctorPendingApproval  = "/doctor-pending-approval"
	EndpointGetProductDetail          = "/shop/products/:product_slug"
	EndpointUserDetails               = "/users/:authentication_id"
	EndpointGetDoctorList             = "/doctors"
	EndpointGetDoctorDetail           = "/doctors/:doctor_id"
	EndpointGetDoctorProfileDetail    = "/doctors/details"
	EndpointRefreshToken              = "/auth/refresh-token"
	EndpointRegisterPartner           = "/auth/register/partners"
	EndpointGetPartnerList            = "/partners"
	EndpointUpdatePartner             = "/partners/:id"
	EndpointUserAddress               = "/users/:authentication_id/addresses"
	EndpointUserAddressDetails        = "/users/:authentication_id/addresses/:address_id"
	EndpointGetPartnerById            = "/partners/:id"
	EndpointGetAllChatRoom            = "/chat-room"
	EndpointCreateChatRoom            = "/chat-room"
	EndpointCreateMessage             = "/message"
	EndpointGetAllMessageOnChatRoom   = "/chat-room/:id"
	EndpointUpdateIsTyping            = "/chat-room/:id"
	EndpointDeleteChatRoom            = "/chat-room/:id"
	EndpointCart                      = "/shop/cart"
	EndpointCartCheckout              = "/shop/cart/checkout"
	EndpointCartDelete                = "/shop/cart/item"
	EndpointPrescription              = "/prescriptions"
	EndpointPrescriptionDetails       = "/prescriptions/:id"
	EndpointUserPrescription          = "/users/prescriptions"
	EndpointDoctorPrescription        = "/doctors/prescriptions"
	EndpointNearbyPharmaciesByProduct = "/shop/nearby-pharmacies/products/:id"
	EndpointProductTotalStock         = "/shop/products/total-stock"
	EndpointAvailableShippings        = "/shop/pharmacy/shippings"
	EndpointRajaOngkirCost            = "/third-parties/rajaongkir/cost"
	EndpointUploadImageCloudinary    = "/cloudinary/image"
)
