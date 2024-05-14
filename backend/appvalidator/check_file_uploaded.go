package appvalidator

import (
	"obatin/appconstant"
	"strings"
)

func IsValidCertificateFileUploaded(size int, extension string) bool {
	return size < appconstant.MaximumSizeFileUploaded && CheckCerificateExtension(extension)
}

func IsValidImageUploaded(size int, extension string) bool {
	return size < appconstant.MaximumSizeImageUploaded && CheckImageExtension(extension)
}

func CheckCerificateExtension(filename string) bool {
	parts := strings.Split(filename, ".")
	extensionIndex := len(parts) - 1

	return parts[extensionIndex] == "pdf"
}

func CheckImageExtension(filename string) bool {
	parts := strings.Split(filename, ".")
	extensionIndex := len(parts) - 1

	return parts[extensionIndex] == "jpg" ||
		parts[extensionIndex] == "jpeg" ||
		parts[extensionIndex] == "png" ||
		parts[extensionIndex] == "webp" ||
		parts[extensionIndex] == "pdf"
}
