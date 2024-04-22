package apperror

import "errors"

var (
	ErrStlUnknownClaims           = errors.New("unknown claims")
	ErrInterfaceCasting           = errors.New("error when casting an interface")
	ErrStlInvalidEmail            = errors.New("invalid email")
	ErrStlInvalidPassword         = errors.New("invalid password")
	ErrStlUploadFileToCloudinary  = errors.New("error upload file to cloudinary")
	ErrStlUploadFileInvalid       = errors.New("file uploaded can not be more than 10 MB and type must be pdf")
	ErrStlConfirmPasswordNotMatch = errors.New("confirm password not match with password")
	ErrStlEmailNotVerified        = errors.New("email has not been verified")
	ErrStlForbiddenAccess         = errors.New("you do not have access")
)
