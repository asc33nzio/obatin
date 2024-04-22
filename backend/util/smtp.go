package util

import (
	"net/smtp"
	"obatin/config"
	"obatin/constant"
)

type EmailParams struct {
	ToEmail          string
	VerificationLink string
	IsAccepted       bool
	DefaultPassword  string
	IsForgotPassword bool
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

	if params.IsAccepted && params.VerificationLink != "" && !params.IsForgotPassword {
		msg = constant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, "", constant.EmailTypeApprove)

	} else if !params.IsAccepted && params.DefaultPassword == "" && params.VerificationLink != "" && !params.IsForgotPassword {
		msg = constant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, "", constant.EmailTypeRejected)

	} else if params.IsForgotPassword {
		msg = constant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, "", constant.EmailForgotPassword)

	} else {
		msg = constant.GetEmailTemplate(se.config.EmailUsernameSender(), params.ToEmail, params.VerificationLink, params.DefaultPassword, constant.EmailTypePasswordTemporary)

	}
	err := smtp.SendMail(se.config.EmailHostSender()+":"+se.config.EmailPortSender(), auth, se.config.EmailUsernameSender(), []string{params.ToEmail}, []byte(msg))
	if err != nil {
		return err
	}

	return nil
}
