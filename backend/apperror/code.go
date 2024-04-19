package apperror

const (
	Internal = iota + 1
	EmailNotRegistered
	InvalidReq
	WrongPassword
	EmailAlreadyRegistered
	NotLogin
	InvalidToken
	InvalidEmailFormat
	InvalidPasswordFormat
	FileUploadedInvalid
	ErrorSqlNoProductExists
)
