package apperror

import (
	"fmt"
	"runtime/debug"
)

type AppError struct {
	code    int
	err     error
	message string
	stack   []byte
}

func NewInternal(err error) *AppError {
	return &AppError{
		code:    Internal,
		err:     err,
		message: InternalErrMsg,
		stack:   debug.Stack(),
	}
}

func NewProductNotFound(err error) *AppError {
	return &AppError{
		code:    ErrorSqlNoProductExists,
		err:     err,
		message: ProductNotFoundMsg,
		stack:   debug.Stack(),
	}
}

func (e *AppError) Error() string {
	return e.message
}

func (e *AppError) StackTrace() []byte {
	return e.stack
}

func (e *AppError) Code() int {
	return e.code
}

func (e *AppError) Err() error {
	return e.err
}

func ErrEmailNotRegistered(err error) *AppError {
	return &AppError{
		code:    EmailNotRegistered,
		err:     err,
		message: EmailNotRegisteredMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidReq(err error) *AppError {
	return &AppError{
		code:    InvalidReq,
		err:     err,
		message: InvalidReqMsg,
		stack:   debug.Stack(),
	}
}

func ErrWrongPassword(err error) *AppError {
	return &AppError{
		code:    WrongPassword,
		err:     err,
		message: WrongEmailPasswordMsg,
		stack:   debug.Stack(),
	}
}

func ErrEmailAlreadyRegistered(err error) *AppError {
	return &AppError{
		code:    EmailAlreadyRegistered,
		err:     err,
		message: EmailAlreadyRegisteredMsg,
		stack:   debug.Stack(),
	}
}

func ErrNotLogin(err error) *AppError {
	return &AppError{
		code:    NotLogin,
		err:     err,
		message: NotLoginMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidToken(err error) *AppError {
	return &AppError{
		code:    InvalidToken,
		err:     err,
		message: InvalidTokenMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidEmail(err error) *AppError {
	return &AppError{
		code:    InvalidEmailFormat,
		err:     err,
		message: InvalidEmailFormatMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidPassword(err error) *AppError {
	return &AppError{
		code:    InvalidPasswordFormat,
		err:     err,
		message: InvalidPasswordFormatMsg,
		stack:   debug.Stack(),
	}
}

func ErrFileCertificateUploadInvalid(err error) *AppError {
	return &AppError{
		code:    FileUploadedInvalid,
		err:     err,
		message: FileCertificateUploadedInvalidMsg,
		stack:   debug.Stack(),
	}
}

func ErrUserNotFound(err error) *AppError {
	return &AppError{
		code:    UserNotFound,
		err:     err,
		message: UserNotFoundMsg,
		stack:   debug.Stack(),
	}
}

func ErrConfirmPasswordNotMatch(err error) *AppError {
	return &AppError{
		code:    InvalidReq,
		err:     err,
		message: ConfirmPasswordNotMatchMsg,
		stack:   debug.Stack(),
	}
}

func ErrEmailNotVerified(err error) *AppError {
	return &AppError{
		code:    EmailNotVerified,
		err:     err,
		message: EmailNotVerifiedMsg,
		stack:   debug.Stack(),
	}
}

func ErrForbiddenAccess(err error) *AppError {
	return &AppError{
		code:    ForbiddenAccess,
		err:     err,
		message: ForbiddenAccessMsg,
		stack:   debug.Stack(),
	}
}

func ErrNoAccessAccountNotVerified(err error) *AppError {
	return &AppError{
		code:    NoAccessAccountNotVerified,
		err:     err,
		message: NoAccessAccountNotVerifiedMsg,
		stack:   debug.Stack(),
	}
}

func ErrAccountNotApproved(err error) *AppError {
	return &AppError{
		code:    EmailNotVerified,
		err:     err,
		message: EmailHasNotApprovedMsg,
		stack:   debug.Stack(),
	}
}

func ErrTokenHasExpired(err error) *AppError {
	return &AppError{
		code:    InvalidToken,
		err:     err,
		message: TokenHasExpiredMsg,
		stack:   debug.Stack(),
	}
}

func ErrTokenHasBeenUsedBefore(err error) *AppError {
	return &AppError{
		code:    InvalidReq,
		err:     err,
		message: TokenHasBeenUsedBeforeMsg,
		stack:   debug.Stack(),
	}
}

func ErrPartnerAlreadyExist(err error) *AppError {
	return &AppError{
		code:    EmailAlreadyRegistered,
		err:     err,
		message: PartnerAlreadyExistMsg,
		stack:   debug.Stack(),
	}
}

func ErrFileLogoUploadInvalid(err error) *AppError {
	return &AppError{
		code:    FileUploadedInvalid,
		err:     err,
		message: FileLogoUploadedInvalidMsg,
		stack:   debug.Stack(),
	}
}

func ErrImgUploadInvalid(err error) *AppError {
	return &AppError{
		code:    FileUploadedInvalid,
		err:     err,
		message: ImgUploadedInvalidMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidSlug(err error) *AppError {
	return &AppError{
		code:    InvalidSlug,
		err:     err,
		message: CategorySlugInvalidMsg,
		stack:   debug.Stack(),
	}
}

func ErrCategoryDuplicateSlug(err error) *AppError {
	return &AppError{
		code:    InvalidSlug,
		err:     err,
		message: CategorySlugDuplicateInvalidMsg,
		stack:   debug.Stack(),
	}
}

func ErrCategoryNotFound(err error) *AppError {
	return &AppError{
		code:    ErrorCategoryNotFound,
		err:     err,
		message: CategoryNotFoundMsg,
		stack:   debug.Stack(),
	}
}

func ErrPartnerNotFound(err error) *AppError {
	return &AppError{
		code:    ErrPartnerNotExist,
		err:     err,
		message: PartnerNotExistMsg,
		stack:   debug.Stack(),
	}
}

func ErrAddressNotFound(err error) *AppError {
	return &AppError{
		code:    AddressNotFound,
		err:     err,
		message: AddressNotFoundMsg,
		stack:   debug.Stack(),
	}
}

func ErrDoctorNotFound(err error) *AppError {
	return &AppError{
		code:    ErrorDoctorNotFound,
		err:     err,
		message: DoctorNotExistMsg,
		stack:   debug.Stack(),
	}
}

func ErrChatRoomNotFound(err error) *AppError {
	return &AppError{
		code:    ErrorChatRoomNotFound,
		err:     err,
		message: ChatRoomNotExistMsg,
		stack:   debug.Stack(),
	}
}

func ErrChatRoomAlreadyExist(err error) *AppError {
	return &AppError{
		code:    ErrorChatRoomAlreadyExist,
		err:     err,
		message: ChatRoomAlreadyExistMsg,
		stack:   debug.Stack(),
	}
}

func ErrChatRoomAlreadyInactive(err error) *AppError {
	return &AppError{
		code:    ErrorChatRoomAlreadyInactive,
		err:     err,
		message: ChatRoomAlreadyInactiveMsg,
		stack:   debug.Stack(),
	}
}

func ErrInvalidSameUpdatedPassword(err error) *AppError {
	return &AppError{
		code:    ErrorInvalidSameAsPrevUpdatePass,
		err:     err,
		message: ErrStlSameasPrevPass,
		stack:   debug.Stack(),
	}
}

func ErrPrescriptionRequired(err error, productId int64) *AppError {
	return &AppError{
		code:    PrescriptionRequired,
		err:     err,
		message: PrescriptionRequiredMsg + fmt.Sprintf(" for product id %v", productId),
		stack:   debug.Stack(),
	}
}

func ErrPrescriptionNotExist(err error) *AppError {
	return &AppError{
		code:    PrescriptionNotExist,
		err:     err,
		message: PrescriptionNotExistMsg,
		stack:   debug.Stack(),
	}
}

func ErrPrescriptionItemNotExist(err error) *AppError {
	return &AppError{
		code:    PrescriptionItemNotExist,
		err:     err,
		message: PrescriptionItemNotExistMsg,
		stack:   debug.Stack(),
	}
}

func ErrNoNearbyPharmacyProduct(err error, productId int64) *AppError {
	return &AppError{
		code:    NoNearbyPharmacyProduct,
		err:     err,
		message: NoNearbyPharmacyProductMsg + fmt.Sprintf(" for product id %v", productId),
		stack:   debug.Stack(),
	}
}

func ErrPharmacyProductAlreadyExist(err error, productId int64) *AppError {
	return &AppError{
		code:    DuplicatePharmacyProduct,
		err:     err,
		message: DuplicatePharmacyProductMsg + fmt.Sprintf(" for product id %v", productId),
		stack:   debug.Stack(),
	}
}

func ErrDuplicateSlug(err error) *AppError {
	return &AppError{
		code:    ErrorDuplicateSlug,
		err:     err,
		message: DuplicateSlugErrorMsg,
		stack:   debug.Stack(),
	}
}

func ErrInsufficientStock(err error, name string) *AppError {
	return &AppError{
		code:    InsufficientStock,
		err:     err,
		message: InsufficientStockMsg + fmt.Sprintf(" for product %v", name),
		stack:   debug.Stack(),
	}
}

func ErrNoNearbyPharmacyPartner(err error) *AppError {
	return &AppError{
		code:    NoNearbyPharmacyPartner,
		err:     err,
		message: NoNearbyPharmacyPartnerMsg,
		stack:   debug.Stack(),
	}
}

func ErrPaymentNotFound(err error) *AppError {
	return &AppError{
		code:    PaymentNotFound,
		err:     err,
		message: PaymentNotFoundMsg,
		stack:   debug.Stack(),
	}
}

func ErrPaymentExpired(err error) *AppError {
	return &AppError{
		code:    PaymentExpired,
		err:     err,
		message: PaymentExpiredMsg,
		stack:   debug.Stack(),
	}
}

func ErrOrderNotFound(err error) *AppError {
	return &AppError{
		code:    OrderNotFound,
		err:     err,
		message: OrderNotFoundMsg,
		stack:   debug.Stack(),
	}
}

func ErrNoPharmacyFromPartner(err error) *AppError {
	return &AppError{
		code:    NoPharmacyFromPartner,
		err:     err,
		message: NoPharmacyFromPartnerMsg,
		stack:   debug.Stack(),
	}
}
