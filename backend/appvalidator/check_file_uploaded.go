package appvalidator

import (
	"obatin/constant"
	"strings"
)

func IsValidFileUploaded(size int, extension string) bool {
	return size < constant.MaximumSizeFileUploaded && CheckExtension(extension)
}

func IsValidImageUploaded(size int, extension string) bool {
	return size < constant.MaximumSizeImageUploaded && CheckImageExtension(extension)
}


func CheckExtension(filename string) bool {
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