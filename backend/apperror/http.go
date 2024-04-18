package apperror

import (
	"net/http"
)

func GetHttpStatusCode(code int) int {
	switch code {
	case Internal:
		return http.StatusInternalServerError
	case EmailNotRegistered:
		return http.StatusNotFound
	case InvalidReq:
		return http.StatusBadRequest
	case WrongPassword:
		return http.StatusUnauthorized
	case EmailAlreadyRegistered:
		return http.StatusConflict
	case NotLogin:
		return http.StatusUnauthorized
	case InvalidToken:
		return http.StatusUnauthorized
	case InvalidEmailFormat:
		return http.StatusBadRequest
	case InvalidPasswordFormat:
		return http.StatusBadRequest
	case FileUploadedInvalid:
		return http.StatusBadRequest
	default:
		return http.StatusInternalServerError
	}
}
