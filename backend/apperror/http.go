package apperror

import (
	"net/http"
)

func GetHttpStatusCode(code int) int {
	switch code {
	case Internal:
		return http.StatusInternalServerError
	default:
		return http.StatusInternalServerError
	}
}
