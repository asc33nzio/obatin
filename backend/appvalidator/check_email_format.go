package appvalidator

import (
	"regexp"
)

func IsValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[^@]+@[^@]+\.\p{L}+$`)
	return emailRegex.MatchString(email)
}
