package apperror

import (
	"runtime/debug"
)

type AppError struct {
	code    int
	err     error
	message string
	stack   []byte
}

func NewInternal(err error) *AppError {
	return &AppError{
		code:    Internal,
		err:     err,
		message: InternalErrMsg,
		stack:   debug.Stack(),
	}
}

func NewProductNotFound(err error) *AppError {
	return &AppError{
		code:    ErrorSqlNoProductExists,
		err:     err,
		message: InternalErrMsg,
		stack:   debug.Stack(),
	}
}

func (e *AppError) Error() string {
	return e.message
}

func (e *AppError) StackTrace() []byte {
	return e.stack
}

func (e *AppError) Code() int {
	return e.code
}

func (e *AppError) Err() error {
	return e.err
}

func ErrEmailNotRegistered(err error) *AppError {
	return &AppError{
		code:    EmailNotRegistered,
		err:     err,
		message: EmailNotRegisteredMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidReq(err error) *AppError {
	return &AppError{
		code:    InvalidReq,
		err:     err,
		message: InvalidReqMsg,
		stack:   debug.Stack(),
	}
}

func ErrWrongPassword(err error) *AppError {
	return &AppError{
		code:    WrongPassword,
		err:     err,
		message: WrongEmailPasswordMsg,
		stack:   debug.Stack(),
	}
}

func ErrEmailAlreadyRegistered(err error) *AppError {
	return &AppError{
		code:    EmailAlreadyRegistered,
		err:     err,
		message: EmailAlreadyRegisteredMsg,
		stack:   debug.Stack(),
	}
}

func ErrNotLogin(err error) *AppError {
	return &AppError{
		code:    NotLogin,
		err:     err,
		message: NotLoginMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidToken(err error) *AppError {
	return &AppError{
		code:    InvalidToken,
		err:     err,
		message: InvalidTokenMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidEmail(err error) *AppError {
	return &AppError{
		code:    InvalidEmailFormat,
		err:     err,
		message: InvalidEmailFormatMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidPassword(err error) *AppError {
	return &AppError{
		code:    InvalidPasswordFormat,
		err:     err,
		message: InvalidPasswordFormatMsg,
		stack:   debug.Stack(),
	}
}

func ErrFileUploadInvalid(err error) *AppError {
	return &AppError{
		code:    FileUploadedInvalid,
		err:     err,
		message: FileUploadedInvalidMsg,
		stack:   debug.Stack(),
	}
}

func ErrConfirmPasswordNotMatch(err error) *AppError {
	return &AppError{
		code:    InvalidReq,
		err:     err,
		message: ConfirmPasswordNotMatchMsg,
		stack:   debug.Stack(),
	}
}

func ErrEmailNotVerified(err error) *AppError {
	return &AppError{
		code:    EmailNotVerified,
		err:     err,
		message: EmailNotVerifiedMsg,
		stack:   debug.Stack(),
	}
}

func ErrForbiddenAccess(err error) *AppError {
	return &AppError{
		code:    ForbiddenAccess,
		err:     err,
		message: ForbiddenAccessMsg,
		stack:   debug.Stack(),
	}
}
