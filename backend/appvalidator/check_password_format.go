package appvalidator

import (
	"obatin/constant"
	"regexp"
)

func IsValidPassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	if !regexp.MustCompile(constant.RegexLowerCase).MatchString(password) {
		return false
	}

	if !regexp.MustCompile(constant.RegexUpperCase).MatchString(password) {
		return false
	}

	if !regexp.MustCompile(constant.RegexDigitCase).MatchString(password) {
		return false
	}

	return true
}
