package middleware

import (
	"errors"
	"time"

	"git.garena.com/naufal.yassar/group-project/appconstant"
	"git.garena.com/naufal.yassar/group-project/apperror"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
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

		requestId, exist := c.Get(appconstant.RequestIdKey)
		if !exist {
			requestId = ""
		}

		uid, exist := c.Get(appconstant.TokenUserIdKey)
		if !exist {
			uid = ""
		}

		entry := log.WithFields(logrus.Fields{
			appconstant.RequestIdKey:        requestId,
			appconstant.TokenUserIdKey:      uid,
			appconstant.LoggerLatencyKey:    time.Since(start),
			appconstant.LoggerMethodKey:     c.Request.Method,
			appconstant.LoggerStatusCodeKey: statusCode,
			appconstant.LoggerPathKey:       path,
		})

		if statusCode >= 500 && statusCode <= 599 {
			var appErr *apperror.AppError
			for _, err := range c.Errors {
				if errors.As(err, &appErr) {
					entry.WithFields(logrus.Fields{
						appconstant.LoggerErrorKey: appErr,
						appconstant.LoggerStackKey: string(appErr.StackTrace()),
					}).Error(appErr.Err().Error())
				}
			}

			return
		}

		entry.Info(appconstant.LoggerRequestProcessed)
	}
}
