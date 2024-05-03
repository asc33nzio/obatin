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
	UserNotFound
	InvalidSlug
	ErrorCategoryNotFound
	EmailNotVerified
	ForbiddenAccess
	ErrPartnerNotExist
	NoAccessAccountNotVerified
	AddressNotFound
	ErrorUserNotFound
	ErrorDoctorNotFound
	ErrorChatRoomNotFound
	ErrorChatRoomAlreadyExist
	ErrorChatRoomAlreadyInactive
	ErrorInvalidSameAsPrevUpdatePass
)
