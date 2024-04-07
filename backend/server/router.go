package server

import (
	"database/sql"
	"net/http"
	"time"

	"git.garena.com/naufal.yassar/group-project/appconstant"
	"git.garena.com/naufal.yassar/group-project/config"
	"git.garena.com/naufal.yassar/group-project/dto"
	"git.garena.com/naufal.yassar/group-project/middleware"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type RouterOpt struct {
	Middleware *middleware.GinMiddleware
}

func createRouter(db *sql.DB, config *config.Config) *gin.Engine {
	middleware := middleware.NewGinMiddleware(config)

	return NewRouter(RouterOpt{
		Middleware: middleware,
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

	return r
}
