package util

import (
	"log"
	"net/smtp"
	"obatin/config"
	"obatin/constant"
)

type SendEmailItf interface {
	SendVerificationEmail(toEmail, verificationLink string, isAccepted bool, defaultPassword string) error
}

type SendEmail struct {
	config *config.Config
}

func NewSendEmail(config *config.Config) *SendEmail {
	return &SendEmail{
		config: config,
	}
}

func (se *SendEmail) SendVerificationEmail(toEmail, verificationLink string, isAccepted bool, defaultPassword string) error {
	auth := smtp.PlainAuth("", se.config.EmailUsernameSender(), se.config.AppMailPassword(), se.config.EmailHostSender())
	var msg string

	if isAccepted && verificationLink != "" {
		msg = constant.GetEmailTemplate(se.config.EmailUsernameSender(), toEmail, verificationLink, "", constant.EmailTypeApprove)

	} else if !isAccepted && defaultPassword == "" && verificationLink != "" {
		msg = constant.GetEmailTemplate(se.config.EmailUsernameSender(), toEmail, verificationLink, "", constant.EmailTypeRejected)

	} else {
		msg = constant.GetEmailTemplate(se.config.EmailUsernameSender(), toEmail, verificationLink, defaultPassword, constant.EmailTypePasswordTemporary)

	}
	log.Printf("msg is: %v", msg)
	err := smtp.SendMail(se.config.EmailHostSender()+":"+se.config.EmailPortSender(), auth, se.config.EmailUsernameSender(), []string{toEmail}, []byte(msg))
	if err != nil {
		return err
	}

	return nil
}
