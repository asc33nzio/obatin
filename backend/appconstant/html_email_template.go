package appconstant

import (
	"fmt"
)

func GetEmailTemplate(senderEmail string, receiverEmail string, verificationLink string, defaultPassword string, emailType string) string {
	var msg string
	switch emailType {
	case EmailTypeApprove:
		msg = fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Account Registered Has Been Approved\r\n"+
			"Content-Type: text/html; charset=utf-8\r\n\r\n"+
			"<html><body>"+
			"<p>Your account has been approved.</p>"+
			"<p>Click the following button to verify your email:</p>"+
			"<a href=\"%s\"><button style=\"background-color: #00B5C0; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;\">Verify Email</button></a>"+
			"<br>"+
			"<br>"+
			"<br>"+
			"<img style=\"height: 30px; width: 80px; display: inline-block;\" src='https://res.cloudinary.com/dzoleanvi/image/upload/v1713343338/go-cloudinary/Component_1_1_m7zyip.jpg'></img>"+
			"<div style=\"font-size: 18px;font-weight:600;\">PT.Obatin Sunteek Indonesia</div>"+
			"<div style=\"font-size: 14px;font-weight:400;\">Jakarta, Indonesia</div>"+
			"</body></html>", senderEmail, receiverEmail, verificationLink)
	case EmailTypeRejected:
		msg = fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Account Registered Has Been Rejected\r\n"+
			"Content-Type: text/html; charset=utf-8\r\n\r\n"+
			"<html><body>"+
			"<p>Sorry your account approval has been rejected.</p>"+
			"<br>"+
			"<br>"+
			"<br>"+
			"<img style=\"height: 30px; width: 80px; display: inline-block;\" src='https://res.cloudinary.com/dzoleanvi/image/upload/v1713343338/go-cloudinary/Component_1_1_m7zyip.jpg'></img>"+
			"<div style=\"font-size: 18px;font-weight:600;\">PT.Obatin Sunteek Indonesia</div>"+
			"<div style=\"font-size: 14px;font-weight:400;\">Jakarta, Indonesia</div>"+
			"</body></html>", senderEmail, receiverEmail)
	case EmailTypePasswordTemporary:
		msg = fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Info : Temporary Account Password\r\n"+
			"Content-Type: text/html; charset=utf-8\r\n\r\n"+
			"<html><body>"+
			"<p>You can login using this default password for temporary:</p>"+
			"<p>password: %s</p>"+
			"<br>"+
			"<br>"+
			"<br>"+
			"<img style=\"height: 30px; width: 80px; display: inline-block;\" src='https://res.cloudinary.com/dzoleanvi/image/upload/v1713343338/go-cloudinary/Component_1_1_m7zyip.jpg'></img>"+
			"<div style=\"font-size: 18px;font-weight:600;\">PT.Obatin Sunteek Indonesia</div>"+
			"<div style=\"font-size: 14px;font-weight:400;\">Jakarta, Indonesia</div>"+
			"</body></html>", senderEmail, receiverEmail, defaultPassword)
	case EmailForgotPassword:
		msg = fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Reset Password\r\n"+
			"Content-Type: text/html; charset=utf-8\r\n\r\n"+
			"<html><body>"+
			"<p>Click the following button to reset your password:</p>"+
			"<a href=\"%s\"><button style=\"background-color: #00B5C0; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;\">Reset Password</button></a>"+
			"<br>"+
			"<br>"+
			"<br>"+
			"<img style=\"height: 30px; width: 80px; display: inline-block;\" src='https://res.cloudinary.com/dzoleanvi/image/upload/v1713343338/go-cloudinary/Component_1_1_m7zyip.jpg'></img>"+
			"<div style=\"font-size: 18px;font-weight:600;\">PT.Obatin Sunteek Indonesia</div>"+
			"<div style=\"font-size: 14px;font-weight:400;\">Jakarta, Indonesia</div>"+
			"</body></html>", senderEmail, receiverEmail, verificationLink)
	case EmailReverifyAccount:
		msg = fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Verify your account before reset password\r\n"+
			"Content-Type: text/html; charset=utf-8\r\n\r\n"+
			"<html><body>"+
			"<p>Click the following button to verify your email before reset your password:</p>"+
			"<a href=\"%s\"><button style=\"background-color: #00B5C0; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;\">Verify Email</button></a>"+
			"<br>"+
			"<br>"+
			"<br>"+
			"<img style=\"height: 30px; width: 80px; display: inline-block;\" src='https://res.cloudinary.com/dzoleanvi/image/upload/v1713343338/go-cloudinary/Component_1_1_m7zyip.jpg'></img>"+
			"<div style=\"font-size: 18px;font-weight:600;\">PT.Obatin Sunteek Indonesia</div>"+
			"<div style=\"font-size: 14px;font-weight:400;\">Jakarta, Indonesia</div>"+
			"</body></html>", senderEmail, receiverEmail, verificationLink)
	}

	return msg
}
