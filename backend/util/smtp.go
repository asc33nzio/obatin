package util

import (
	"net/smtp"
	"obatin/appconstant"
	"obatin/config"
)

type EmailParams struct {
	ToEmail          string
	VerificationLink string
	IsAccepted       bool
	DefaultPassword  string
	IsForgotPassword bool
	IsReverified     bool
}

type SendEmailItf interface {
	SendVerificationEmail(params EmailParams) error
}

type SendEmail struct {
	config *config.Config
}

func NewSendEmail(config *config.Config) *SendEmail {
	return &SendEmail{
		config: config,
	}
}

func (se *SendEmail) SendVerificationEmail(params EmailParams) error {
	auth := smtp.PlainAuth("", se.config.EmailUsernameSender(), se.config.AppMailPassword(), se.config.EmailHostSender())
	var msg string

	if params.IsAccepted && params.VerificationLink != "" && !params.IsForgotPassword && !params.IsReverified {
		msg = appconstant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, "", appconstant.EmailTypeApprove)

	} else if !params.IsAccepted && params.DefaultPassword == "" && params.VerificationLink != "" && !params.IsForgotPassword && !params.IsReverified {
		msg = appconstant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, "", appconstant.EmailTypeRejected)

	} else if params.IsReverified {
		msg = appconstant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, "", appconstant.EmailReverifyAccount)

	} else if params.IsForgotPassword {
		msg = appconstant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, "", appconstant.EmailForgotPassword)

	} else {
		msg = appconstant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, params.DefaultPassword, appconstant.EmailTypePasswordTemporary)
	}
	err := smtp.SendMail(se.config.EmailHostSender()+":"+se.config.EmailPortSender(), auth, se.config.EmailUsernameSender(), []string{params.ToEmail}, []byte(msg))
	if err != nil {
		return err
	}

	return nil
}
