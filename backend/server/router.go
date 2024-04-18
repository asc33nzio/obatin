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
	AuthenticationHandler *handler.AuthenticationHandler
	ProductHandler *handler.ProductHandler
	Middleware            *middleware.GinMiddleware
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

	return NewRouter(RouterOpt{
		Middleware:            middleware,
		AuthenticationHandler: authentiationHandler,
		ProductHandler: productHandler,
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
	r.POST(appconstant.EndpointLogin, h.AuthenticationHandler.Login)
	r.POST(appconstant.EndpointRegisterDoctor, h.AuthenticationHandler.RegisterDoctor)
	r.POST(appconstant.EndpointRegisterUser, h.AuthenticationHandler.RegisterUser)
	r.POST(appconstant.EndpointVerify, h.AuthenticationHandler.VerifyEmail)
	r.POST(appconstant.EndpointApproval, h.AuthenticationHandler.UpdateApproval)

	r.GET(appconstant.EndpointGetProductsList, h.ProductHandler.GetAllProducts)
	r.PATCH(appconstant.EndpointUpdatePassword, h.AuthenticationHandler.UpdatePassword)
	
	r.Use(h.Middleware.JWTAuth)
	r.POST(appconstant.EndpointSendVerifyToEmail, h.AuthenticationHandler.SendVerifyToEmail)

	r.GET(appconstant.EndpointPing, func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, dto.APIResponse{
			Message: appconstant.ResponsePongMsg,
		})
	})

	return r
}
