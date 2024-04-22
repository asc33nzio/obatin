package appvalidator

func IsValidPassword(password string) bool {
	if len(password) < 9 {
		return false
	}

	hasLowerCase := false
	hasUpperCase := false
	hasDigit := false

	for _, char := range password {
		if 'a' <= char && char <= 'z' {
			hasLowerCase = true
		}
		if 'A' <= char && char <= 'Z' {
			hasUpperCase = true
		}
		if '0' <= char && char <= '9' {
			hasDigit = true
		}
	}

	return hasLowerCase && hasUpperCase && hasDigit
}
