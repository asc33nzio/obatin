package appvalidator

import (
	"obatin/constant"
	"strings"
)

func IsValidFileUploaded(size int, extension string) bool {
	return size < constant.MaximumSizeFileUploaded && CheckExtension(extension)
}

func CheckExtension(filename string) bool {
	parts := strings.Split(filename, ".")
	extensionIndex := len(parts) - 1

	return parts[extensionIndex] == "pdf"
}
