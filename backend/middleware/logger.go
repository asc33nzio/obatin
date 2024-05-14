package middleware

import (
	"errors"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"obatin/appconstant"
	"obatin/apperror"
)

func (m *GinMiddleware) Logger(log *logrus.Logger) func(c *gin.Context) {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		if raw != "" {
			path = path + "?" + raw
		}

		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		userAgent := c.Request.UserAgent()
		requestBody := c.Request.Body
		responseSize := c.Writer.Size()

		requestId, exist := c.Get(appconstant.RequestIdKey)
		if !exist {
			requestId = ""
		}

		aid, exist := c.Get(appconstant.AuthenticationIdKey)
		if !exist {
			aid = ""
		}

		location, _ := time.LoadLocation("Asia/Jakarta")

		entry := log.WithFields(logrus.Fields{
			appconstant.RequestIdKey:          requestId,
			appconstant.AuthenticationIdKey:   aid,
			appconstant.LoggerLatencyKey:      time.Since(start),
			appconstant.LoggerMethodKey:       c.Request.Method,
			appconstant.LoggerStatusCodeKey:   statusCode,
			appconstant.LoggerPathKey:         path,
			appconstant.LoggerClientIpKey:     clientIP,
			appconstant.LoggerUserAgentKey:    userAgent,
			appconstant.LoggerRequestBodyKey:  requestBody,
			appconstant.LoggerResponseSizeKey: responseSize,
		})

		if statusCode >= 500 && statusCode <= 599 {
			var appErr *apperror.AppError
			for _, err := range c.Errors {
				if errors.As(err, &appErr) {
					entry.WithFields(logrus.Fields{
						appconstant.LoggerErrorKey: appErr,
						appconstant.LoggerStackKey: string(appErr.StackTrace()),
					}).WithTime(start.In(location)).Error(appErr.Err().Error())
				}
			}

			return
		}

		entry.WithTime(start.In(location)).Info(appconstant.LoggerRequestProcessed)
	}
}
