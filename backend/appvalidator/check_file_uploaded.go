package appvalidator

import (
	"obatin/constant"
	"strings"
)

func IsValidCertificateFileUploaded(size int, extension string) bool {
	return size < constant.MaximumSizeFileUploaded && CheckCerificateExtension(extension)
}

func IsValidImageUploaded(size int, extension string) bool {
	return size < constant.MaximumSizeImageUploaded && CheckImageExtension(extension)
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
		parts[extensionIndex] == "png" ||
		parts[extensionIndex] == "webp" ||
		parts[extensionIndex] == "svg"
}
