package apperror

const (
	InternalErrMsg                    = "internal server error"
	EmailNotRegisteredMsg             = "email is not registered"
	InvalidReqMsg                     = "invalid request, please check your input"
	WrongEmailPasswordMsg             = "wrong email or password"
	EmailAlreadyRegisteredMsg         = "email is already registered"
	NotLoginMsg                       = "you do not have access, you must login first"
	InvalidTokenMsg                   = "invalid token"
	InvalidEmailFormatMsg             = "invalid email format"
	InvalidPasswordFormatMsg          = "password must contain uppercase, lowercase, number and minimum 8 length"
	FileCertificateUploadedInvalidMsg = "file uploaded can not be more than 10 MB and type must be pdf"
	ImgUploadedInvalidMsg             = "image uploaded can not be more than 500 Kb and type must be jpg, png, svg, or webp"
	ConfirmPasswordNotMatchMsg        = "confirm password and password should be the same"
	EmailNotVerifiedMsg               = "you have not verified your account, check your email and verified first"
	ForbiddenAccessMsg                = "You do not have access to do this action"
	ProductNotFoundMsg                = "product not found"
	CategorySlugInvalidMsg            = "category slug already exist"
	CategorySlugDuplicateInvalidMsg   = "category slug can't be the same as previous"
	CategoryNotFoundMsg               = "category not found"
	DoctorNotFoundMsg                 = "doctor not found"
	EmailHasNotApprovedMsg            = "you must wait until admin approved your account"
	TokenHasExpiredMsg                = "token has expired"
	UserStillHaveValidTokenMsg        = "you can not make this request, you stil have valid token"
	TokenHasBeenUsedBeforeMsg         = "token has been used before, please make new request"
	PartnerAlreadyExistMsg            = "partner already exist"
	FileLogoUploadedInvalidMsg        = "file uploaded can not be more than 10 MB and type must be jpg/jpeg/png"
	PartnerNotExistMsg                = "partner not exist"
	UserNotFoundMsg                   = "user not found"
	NoAccessAccountNotVerifiedMsg     = "you don't have access, please verify your account first"
	TokenHasBeenUsedBefore            = "token has been used before, please make new request"
	AddressNotFoundMsg                = "address not found"
	UserNotExistMsg                   = "user not exist"
	DoctorNotExistMsg                 = "doctor not exist"
	ChatRoomNotExistMsg               = "chat room not exist"
	ChatRoomAlreadyExistMsg           = "chat room already exist"
	ChatRoomAlreadyInactiveMsg        = "chat room already inactive"
	ErrStlSameasPrevPass              = "new password can't be the same as old password"
)
