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
