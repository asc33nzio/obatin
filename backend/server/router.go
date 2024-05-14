package server

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"obatin/appconstant"
	"obatin/config"
	"obatin/dto"
	"obatin/handler"
	"obatin/middleware"
	"obatin/repository"
	"obatin/usecase"
	"obatin/util"
)

type RouterOpt struct {
	AuthenticationHandler       *handler.AuthenticationHandler
	ProductHandler              *handler.ProductHandler
	CategoryHandler             *handler.CategoryHandler
	Middleware                  *middleware.GinMiddleware
	DoctorSpecializationHandler *handler.DoctorSpecializationHandler
	UserHandler                 *handler.UserHandler
	AddressHandler              *handler.AddressHandler
	PartnerHandler              *handler.PartnerHandler
	MessageHandler              *handler.MessageHandler
	ChatRoomHandler             *handler.ChatRoomHandler
	DoctorHandler               *handler.DoctorHandler
	CartHandler                 *handler.CartHandler
	PrescriptionHandler         *handler.PrescriptionHandler
	CloudinaryHandler           *handler.CloudinaryHandler
	PharmacyProductHandler      *handler.PharmacyProductHandler
	ThirdPartyHandler           *handler.ThirdPartyHandler
	ShippingHandler             *handler.ShippingHandler
	OrderHandler                *handler.OrderHandler
	PaymentHandler              *handler.PaymentHandler
	ManufacturerHandler         *handler.ManufacturerHandler
	PharmacyHandler             *handler.PharmacyHandler
	StockMovementHandler        *handler.StockMovementHandler
}

func createRouter(db *sql.DB, config *config.Config) *gin.Engine {
	jwtAuth := util.NewJWTAuth(config)
	middleware := middleware.NewGinMiddleware(config, jwtAuth)
	cryptoHash := util.NewCryptoBcrypt()
	dbStore := repository.NewDBStore(db)
	tokenGenerator := util.NewTokenGenerator()
	cloudinaryUpload := util.NewCloudinaryUpload(config)
	sendEmail := util.NewSendEmail(config)

	cloudinaryUseCase := usecase.NewCloudinaryUseCaseImpl(cloudinaryUpload)
	cloudinaryHandler := handler.NewCloudinaryHandler(cloudinaryUseCase)

	authenticationUsecase := usecase.NewAuthenticationUsecaseImpl(dbStore, cryptoHash, jwtAuth, config, tokenGenerator, cloudinaryUpload, sendEmail)
	authentiationHandler := handler.NewAuthenticationHandler(authenticationUsecase)

	productUseCase := usecase.NewProductUsecaseImpl(dbStore, config, cloudinaryUpload)
	productHandler := handler.NewProductHandler(productUseCase)

	doctorSpecializationUsecase := usecase.NewDoctorSpecializationUsecaseImpl(dbStore, config)
	doctorSpecializationHandler := handler.NewDoctorSpecializationHandler(doctorSpecializationUsecase)

	categoryUseCase := usecase.NewCategoryUsecaseImpl(dbStore, config, cloudinaryUpload)
	categoryHandler := handler.NewCategoryHandler(categoryUseCase)

	partnerUsecase := usecase.NewPartnerUsecaseImpl(dbStore, config, cryptoHash, jwtAuth, tokenGenerator, cloudinaryUpload, sendEmail)
	partnerHandler := handler.NewPartnerHandler(partnerUsecase)

	userUsecase := usecase.NewUserUsecaseImpl(dbStore, config, cloudinaryUpload)
	userHandler := handler.NewUserHandler(userUsecase)

	addressUsecase := usecase.NewAddressUsecaseImpl(dbStore, config)
	addressHandler := handler.NewAddressHandler(addressUsecase)

	messageUsecase := usecase.NewMessageUsecaseImpl(dbStore, cryptoHash, jwtAuth, config, tokenGenerator, cloudinaryUpload, sendEmail)
	messageHandler := handler.NewMessageHandler(messageUsecase)

	chatRoomUsecase := usecase.NewChatRoomUsecaseImpl(dbStore, cryptoHash, jwtAuth, config, tokenGenerator, cloudinaryUpload, sendEmail)
	chatRoomHandler := handler.NewChatRoomHandler(chatRoomUsecase, authenticationUsecase)

	doctorUsecase := usecase.NewDoctorUsecaseImpl(dbStore, config, cloudinaryUpload)
	doctorHandler := handler.NewDoctorHandler(doctorUsecase)

	cartUsecase := usecase.NewCartUsecaseImpl(dbStore, config)
	cartHandler := handler.NewCartHandler(cartUsecase)

	prescriptionUsecase := usecase.NewPrescriptionUsecaseImpl(dbStore, config)
	prescriptionHandler := handler.NewPrescriptionHandler(prescriptionUsecase)

	pharmacyProductUsecase := usecase.NewPharmacyProductUsecaseImpl(dbStore, config)
	pharmacyProductHandler := handler.NewPharmacyProductHandler(pharmacyProductUsecase)

	shippingUsecase := usecase.NewShippingUsecaseImpl(dbStore, config)
	shippingHandler := handler.NewShippingHandler(shippingUsecase, config)

	orderUsecase := usecase.NewOrderUsecaseImpl(dbStore, config)
	orderHandler := handler.NewOrderHandler(orderUsecase)

	paymentUsecase := usecase.NewPaymentUsecaseImpl(dbStore, config, cloudinaryUpload)
	paymentHandler := handler.NewPaymentHandler(paymentUsecase)

	manufacturerUseCase := usecase.NewManufacturerUsecaseImpl(dbStore, config)
	manufacturerHandler := handler.NewManufacturerHandler(manufacturerUseCase)

	pharmacyUseCase := usecase.NewPharmacyUsecaseImpl(dbStore, config)
	pharmacyHandler := handler.NewPharmacyHandler(pharmacyUseCase)

	stockMovementUsecase := usecase.NewStockMovementUsecaseImpl(dbStore, config)
	stockMovementHandler := handler.NewStockMovementHandler(stockMovementUsecase)

	thirdPartyHandler := handler.NewThirdPartyHandler(config)

	return NewRouter(RouterOpt{
		Middleware:                  middleware,
		AuthenticationHandler:       authentiationHandler,
		ProductHandler:              productHandler,
		DoctorSpecializationHandler: doctorSpecializationHandler,
		CategoryHandler:             categoryHandler,
		PartnerHandler:              partnerHandler,
		UserHandler:                 userHandler,
		AddressHandler:              addressHandler,
		DoctorHandler:               doctorHandler,
		MessageHandler:              messageHandler,
		ChatRoomHandler:             chatRoomHandler,
		CartHandler:                 cartHandler,
		PrescriptionHandler:         prescriptionHandler,
		CloudinaryHandler:           cloudinaryHandler,
		PharmacyProductHandler:      pharmacyProductHandler,
		ThirdPartyHandler:           thirdPartyHandler,
		ShippingHandler:             shippingHandler,
		OrderHandler:                orderHandler,
		PaymentHandler:              paymentHandler,
		ManufacturerHandler:         manufacturerHandler,
		PharmacyHandler:             pharmacyHandler,
		StockMovementHandler:        stockMovementHandler,
	})
}

func Init(db *sql.DB, config *config.Config) *gin.Engine {
	router := createRouter(db, config)

	return router
}

func NewRouter(h RouterOpt) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())

	log := logrus.New()
	log.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: time.RFC3339,
	})

	r.ContextWithFallback = true

	r.Use(h.Middleware.Cors)
	r.Use(h.Middleware.RequestId)
	r.Use(h.Middleware.Logger(log))
	r.Use(h.Middleware.ErrorHandler)

	r.GET(appconstant.EndpointPing, func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, dto.APIResponse{
			Message: appconstant.ResponsePongMsg,
		})
	})
	r.NoRoute(func(ctx *gin.Context) {
		ctx.JSON(http.StatusNotFound, dto.APIResponse{
			Message: appconstant.ResponseNotfoundMsg,
		})
	})
	r.NoMethod(func(ctx *gin.Context) {
		ctx.JSON(http.StatusNotFound, dto.APIResponse{
			Message: appconstant.ResponseNotfoundMsg,
		})
	})

	r.POST(appconstant.EndpointLogin, h.AuthenticationHandler.Login)
	r.POST(appconstant.EndpointRegisterDoctor, h.AuthenticationHandler.RegisterDoctor)
	r.POST(appconstant.EndpointRegisterUser, h.AuthenticationHandler.RegisterUser)
	r.POST(appconstant.EndpointVerify, h.AuthenticationHandler.VerifyEmail)

	r.GET(appconstant.EndpointGetProductsList, h.ProductHandler.GetAllProducts)
	r.GET(appconstant.EndpointGetProductDetail, h.ProductHandler.GetProductDetailBySlug)
	r.GET(appconstant.EndPointAllCategories, h.CategoryHandler.GetAllCategory)
	r.GET(appconstant.EndpointGetDoctorList, h.DoctorHandler.GetAllDoctor)
	r.PATCH(appconstant.EndpointResetPassword, h.AuthenticationHandler.UpdatePasswordByToken)
	r.POST(appconstant.EndpointForgotPassword, h.AuthenticationHandler.SendVerifyForgotPassword)
	r.GET(appconstant.EndpointGetDoctorSpecialization, h.DoctorSpecializationHandler.GetAll)
	r.POST(appconstant.EndpointRefreshToken, h.AuthenticationHandler.GetRefreshToken)

	r.POST(appconstant.EndpointRajaOngkirCost, h.ThirdPartyHandler.RajaOngkirCost)

	r.Use(h.Middleware.JWTAuth)

	r.GET(appconstant.EndpointManufacturerList, h.ManufacturerHandler.GetAllManufacturers)
	r.GET(appconstant.EndpointGetProductsListAdmin, h.ProductHandler.GetAllProducts)
	r.PATCH(appconstant.EndpointGetProductDetail, h.ProductHandler.UpdateProductDetaiBySlug)
	r.GET(appconstant.EndpointAdminGetProductDetail, h.ProductHandler.GetProductDetailBySlug)
	r.GET(appconstant.EndpointAllPharmacies, h.PharmacyHandler.GetAllPharmacy)
	r.GET(appconstant.EndpointPartnerPharmacyProducts, h.PharmacyProductHandler.GetAllPartnerPharmacyProduct)
	r.POST(appconstant.EndpointPartnerPharmacyProducts, h.PharmacyProductHandler.CreateOnePharmacyProduct)
	r.PATCH(appconstant.EndpointDetailPartnerPharmacyProducts, h.PharmacyProductHandler.UpdatePharmacyProduct)
	r.POST(appconstant.EndpointUploadImageCloudinary, h.CloudinaryHandler.UploadImageOrFileToCloudinary)
	r.PATCH(appconstant.EndpointGetDoctorDetail, h.DoctorHandler.UpdateOneDoctor)
	r.GET(appconstant.EndpointGetDoctorProfileDetail, h.DoctorHandler.GetDoctorDetailbyAuthId)
	r.POST(appconstant.EndpointSendVerifyToEmail, h.AuthenticationHandler.SendVerifyToEmail)
	r.POST(appconstant.EndpointGetProductsList, h.ProductHandler.CreateProduct)
	r.POST(appconstant.EndpointApproval, h.AuthenticationHandler.UpdateApproval)
	r.PATCH(appconstant.EndpointUpdatePassword, h.AuthenticationHandler.UpdatePasswordByAuth)
	r.GET(appconstant.EndpointGetDoctorPendingApproval, h.AuthenticationHandler.GetPendingDoctorApproval)
	r.POST(appconstant.EndpointRegisterPartner, h.PartnerHandler.RegisterPartner)
	r.GET(appconstant.EndpointGetPartnerList, h.PartnerHandler.GetAllPartner)
	r.PATCH(appconstant.EndpointUpdatePartner, h.PartnerHandler.UpdateOnePartner)
	r.GET(appconstant.EndpointGetPartnerById, h.PartnerHandler.GetPartnerDetailById)
	r.PATCH(appconstant.EndpointUserDetails, h.UserHandler.UpdateUserDetails)
	r.GET(appconstant.EndpointUserDetails, h.UserHandler.GetUserDetails)
	r.POST(appconstant.EndpointUserAddress, h.AddressHandler.CreateOneAddress)
	r.PATCH(appconstant.EndpointUserAddressDetails, h.AddressHandler.UpdateOneAddress)
	r.DELETE(appconstant.EndpointUserAddressDetails, h.AddressHandler.DeleteOneAddress)
	r.POST(appconstant.EndPointAllCategories, h.CategoryHandler.CreateOneCategory)
	r.PATCH(appconstant.EndpointUpdateCategory, h.CategoryHandler.UpdateOneCategory)
	r.DELETE(appconstant.EndpointUpdateCategory, h.CategoryHandler.DeleteOneCategoryBySlug)
	r.POST(appconstant.EndpointCreateChatRoom, h.ChatRoomHandler.CreateChatRoom)
	r.POST(appconstant.EndpointCreateMessage, h.MessageHandler.CreateMessage)
	r.GET(appconstant.EndpointGetAllMessageOnChatRoom, h.ChatRoomHandler.GetAllMessageByChatRoomId)
	r.PATCH(appconstant.EndpointUpdateIsTyping, h.ChatRoomHandler.UpdateIsTyping)
	r.GET(appconstant.EndpointGetAllChatRoom, h.ChatRoomHandler.GetListChatRoom)
	r.DELETE(appconstant.EndpointDeleteChatRoom, h.ChatRoomHandler.DeleteChatRoom)
	r.PATCH(appconstant.EndpointUpdateChatIsActive, h.ChatRoomHandler.UpdateChatRoomInactiveByChatRoomId)
	r.POST(appconstant.EndpointCart, h.CartHandler.Bulk)
	r.GET(appconstant.EndpointCartDetails, h.CartHandler.GetCartDetails)
	r.PUT(appconstant.EndpointCart, h.CartHandler.UpdateOneCartItemQuantity)
	r.POST(appconstant.EndpointCartDelete, h.CartHandler.DeleteOneCartItem)
	r.POST(appconstant.EndpointPrescription, h.PrescriptionHandler.CreatePrescription)
	r.GET(appconstant.EndpointNearbyPharmaciesByProduct, h.PharmacyProductHandler.GetNearbyPharmacies)
	r.POST(appconstant.EndpointProductTotalStock, h.PharmacyProductHandler.TotalStockPerPartner)
	r.POST(appconstant.EndpointAvailableShippings, h.ShippingHandler.AvailableShippingsPerPharmacy)
	r.POST(appconstant.EndpointCartCheckout, h.CartHandler.Checkout)
	r.GET(appconstant.EndpointUserPrescription, h.PrescriptionHandler.GetAllUserPrescriptions)
	r.GET(appconstant.EndpointPrescriptionDetails, h.PrescriptionHandler.GetPrescriptionDetails)
	r.GET(appconstant.EndpointDoctorPrescription, h.PrescriptionHandler.GetAllDoctorPrescriptions)
	r.GET(appconstant.EndpointUserOrders, h.OrderHandler.GetUserOrders)
	r.PATCH(appconstant.EndpointPaymentDetails, h.PaymentHandler.UploadPaymentProof)
	r.POST(appconstant.EndpointPaymentConfirmation, h.PaymentHandler.UpdatePaymentStatus)
	r.GET(appconstant.EndpointPendingPayments, h.PaymentHandler.GetAllPendingPayment)
	r.GET(appconstant.EndpointOrders, h.OrderHandler.GetAllOrders)
	r.POST(appconstant.EndpointPaymentCancel, h.PaymentHandler.CancelPayment)
	r.GET(appconstant.EndpointCart, h.CartHandler.GetCart)
	r.PATCH(appconstant.EndpointOrdersDetails, h.OrderHandler.UpdateOrderStatus)
	r.GET(appconstant.EndpointGetAllStockMovements, h.StockMovementHandler.GetAllStockMovements)

	return r
}
