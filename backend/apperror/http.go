package apperror

import (
	"net/http"
)

func GetHttpStatusCode(code int) int {
	switch code {
	case Internal:
		return http.StatusInternalServerError
	case EmailNotRegistered:
		return http.StatusNotFound
	case InvalidReq:
		return http.StatusBadRequest
	case WrongPassword:
		return http.StatusUnauthorized
	case EmailAlreadyRegistered:
		return http.StatusConflict
	case NotLogin:
		return http.StatusUnauthorized
	case InvalidToken:
		return http.StatusUnauthorized
	case InvalidEmailFormat:
		return http.StatusBadRequest
	case InvalidPasswordFormat:
		return http.StatusBadRequest
	case FileUploadedInvalid:
		return http.StatusBadRequest
	case EmailNotVerified:
		return http.StatusUnauthorized
	case ForbiddenAccess:
		return http.StatusForbidden
	case ErrorSqlNoProductExists:
		return http.StatusNotFound
	case UserNotFound:
		return http.StatusNotFound
	case NoAccessAccountNotVerified:
		return http.StatusForbidden
	case InvalidSlug:
		return http.StatusBadRequest
	case ErrorCategoryNotFound:
		return http.StatusBadRequest
	case ErrorUserNotFound:
		return http.StatusBadRequest
	case ErrorChatRoomNotFound:
		return http.StatusBadRequest
	case ErrorChatRoomAlreadyExist:
		return http.StatusConflict
	case ErrorChatRoomAlreadyInactive:
		return http.StatusBadRequest
	case ErrorDoctorNotFound:
		return http.StatusNotFound
	case AddressNotFound:
		return http.StatusNotFound
	case PrescriptionRequired:
		return http.StatusBadRequest
	case PrescriptionNotExist:
		return http.StatusNotFound
	case PrescriptionItemNotExist:
		return http.StatusNotFound
	case NoNearbyPharmacyProduct:
		return http.StatusNotFound
	case DuplicatePharmacyProduct:
		return http.StatusBadRequest
	case ErrorInvalidSameAsPrevUpdatePass:
		return http.StatusBadRequest
	case ErrorDuplicateSlug:
		return http.StatusBadRequest
	case InsufficientStock:
		return http.StatusBadRequest
	case NoNearbyPharmacyPartner:
		return http.StatusNotFound
	case NoPharmacyFromPartner:
		return http.StatusNotFound
	case OrderNotFound:
		return http.StatusNotFound
	case PaymentNotFound:
		return http.StatusNotFound
	case PaymentExpired:
		return http.StatusBadRequest
	default:
		return http.StatusInternalServerError
	}
}
