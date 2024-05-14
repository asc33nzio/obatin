package appvalidator

import (
	"obatin/appconstant"
	"regexp"
)

func IsValidPassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	if !regexp.MustCompile(appconstant.RegexLowerCase).MatchString(password) {
		return false
	}

	if !regexp.MustCompile(appconstant.RegexUpperCase).MatchString(password) {
		return false
	}

	if !regexp.MustCompile(appconstant.RegexDigitCase).MatchString(password) {
		return false
	}

	return true
}
