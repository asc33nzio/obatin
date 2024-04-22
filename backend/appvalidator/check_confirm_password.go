package appvalidator

func CheckConfirmPassword (password string, confirmPassword string) bool {
	return password == confirmPassword
}