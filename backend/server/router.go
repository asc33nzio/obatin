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
}

func createRouter(db *sql.DB, config *config.Config) *gin.Engine {
	jwtAuth := util.NewJWTAuth(config)
	middleware := middleware.NewGinMiddleware(config, jwtAuth)
	cryptoHash := util.NewCryptoBcrypt()
	dbStore := repository.NewDBStore(db)
	tokenGenerator := util.NewTokenGenerator()
	cloudinaryUpload := util.NewCloudinaryUpload(config)
	sendEmail := util.NewSendEmail(config)

	authenticationUsecase := usecase.NewAuthenticationUsecaseImpl(dbStore, cryptoHash, jwtAuth, config, tokenGenerator, cloudinaryUpload, sendEmail)
	authentiationHandler := handler.NewAuthenticationHandler(authenticationUsecase)

	productUseCase := usecase.NewProductUsecaseImpl(dbStore, config)
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
	r.POST(appconstant.EndpointLogin, h.AuthenticationHandler.Login)
	r.POST(appconstant.EndpointRegisterDoctor, h.AuthenticationHandler.RegisterDoctor)
	r.POST(appconstant.EndpointRegisterUser, h.AuthenticationHandler.RegisterUser)
	r.POST(appconstant.EndpointVerify, h.AuthenticationHandler.VerifyEmail)

	r.GET(appconstant.EndpointGetProductsList, h.ProductHandler.GetAllProducts)
	r.GET(appconstant.EndpointGetProductDetail, h.ProductHandler.GetProductDetailBySlug)
	r.GET(appconstant.EndPointAllCategories, h.CategoryHandler.GetAllCategory)
	r.GET(appconstant.EndpointGetDoctorList, h.DoctorHandler.GetAllDoctor)
	r.PATCH(appconstant.EndpointUpdatePassword, h.AuthenticationHandler.UpdatePassword)
	r.POST(appconstant.EndpointForgotPassword, h.AuthenticationHandler.SendVerifyForgotPassword)
	r.GET(appconstant.EndpointGetDoctorSpecialization, h.DoctorSpecializationHandler.GetAll)
	r.POST(appconstant.EndpointRefreshToken, h.AuthenticationHandler.GetRefreshToken)

	r.Use(h.Middleware.JWTAuth)

	r.PATCH(appconstant.EndpointGetDoctorDetail, h.DoctorHandler.UpdateOneDoctor)
	r.GET(appconstant.EndpointGetDoctorProfileDetail, h.DoctorHandler.GetDoctorDetailbyAuthId)
	r.POST(appconstant.EndpointSendVerifyToEmail, h.AuthenticationHandler.SendVerifyToEmail)
	r.POST(appconstant.EndpointApproval, h.AuthenticationHandler.UpdateApproval)
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
	return r
}
