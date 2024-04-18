package appvalidator

import (
	"strings"
)

func IsValidEmail(email string) bool {
	parts := strings.Split(email, "@")
	if len(parts) != 2 || len(parts[0]) == 0 {
		return false
	}
	domainParts := strings.Split(parts[1], ".")
	return len(domainParts) >= 2
}
