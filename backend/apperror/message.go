package apperror

const (
	InternalErrMsg            = "internal server error"
	EmailNotRegisteredMsg     = "email is not registered"
	InvalidReqMsg             = "invalid request, please check your input"
	WrongEmailPasswordMsg     = "wrong email or password"
	EmailAlreadyRegisteredMsg = "email is already registered"
	NotLoginMsg               = "you do not have access, you must login first"
	InvalidTokenMsg           = "invalid token"
	InvalidEmailFormatMsg     = "invalid email format"
	InvalidPasswordFormatMsg  = "password must contain uppercase, lowercase, number and minimum 8 length"
	FileUploadedInvalidMsg    = "file uploaded can not be more than 10 MB and type must be pdf"
)
