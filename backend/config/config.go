package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	dbUrl                   string
	jwtIss                  string
	jwtLoginExp             int
	jwtSecret               string
	serverPort              string
	hashCost                int
	defaultPassword         string
	appMailPassword         string
	defaultEndpointFrontend string
	emailUsernameSender     string
	emailHostSender         string
	emailPortSender         string
	cloudinaryCloudName     string
	cloudinaryAPIKey        string
	cloudinaryAPISecret     string
	cloudinaryUploadFolder  string
	cloudinaryURL           string
	tokenLength             int
	randomTokenLength       int
	verificationLinkBase    string
	resetLinkBase           string
	jwtVerifyDoctorExp      int
	jwtVerifyUserExp        int
	jwtRefreshTokenExp      int
	jwtForgotPasswordExp    int
	rajaOngkirApiKey        string
	rajaOngkirCostApiUrl    string
}

func NewConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	dbUrl := os.Getenv("DATABASE_URL")

	hashCost, err := strconv.Atoi(os.Getenv("HASH_COST"))
	if err != nil {
		return nil, err
	}

	jwtLoginExp, err := strconv.Atoi(os.Getenv("JWT_LOGIN_EXP"))
	if err != nil {
		return nil, err
	}

	jwtRefreshTokenExp, err := strconv.Atoi(os.Getenv("JWT_REFRESH_TOKEN_EXP"))
	if err != nil {
		return nil, err
	}

	tokenLength, err := strconv.Atoi(os.Getenv("RANDOM_TOKEN_LENGTH"))
	if err != nil {
		return nil, err
	}

	randomTokenLength, err := strconv.Atoi(os.Getenv("RANDOM_TOKEN_PASSWORD_LENGTH"))
	if err != nil {
		return nil, err
	}

	jwtVerifyDoctorExp, err := strconv.Atoi(os.Getenv("JWT_VERIFY_DOCTOR_EXP"))
	if err != nil {
		return nil, err
	}

	jwtVerifyUserExp, err := strconv.Atoi(os.Getenv("JWT_VERIFY_USER_EXP"))
	if err != nil {
		return nil, err
	}

	jwtForgotPasswordExp, err := strconv.Atoi(os.Getenv("JWT_FORGOT_PASSWORD_EXP"))
	if err != nil {
		return nil, err
	}

	jwtIss := os.Getenv("JWT_ISSUER")
	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	serverPort := os.Getenv("SERVER_PORT")
	appMailPassword := os.Getenv("DEFAULT_GMAIL_APP_PASSWORD")
	defaultEndpointFrontend := os.Getenv("DEFAULT_ENDPOINT_FRONTEND")
	emailUsernameSender := os.Getenv("DEFAULT_USERNAME_EMAIL")
	emailHostSender := os.Getenv("DEFAULT_HOST_EMAIL")
	emailPortSender := os.Getenv("DEFAULT_PORT_EMAIL")
	cloudinaryCloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	cloudinaryAPIKey := os.Getenv("CLOUDINARY_KEY")
	cloudinaryAPISecret := os.Getenv("CLOUDINARY_SECRET")
	cloudinaryUploadFolder := os.Getenv("CLOUDINARY_UPLOAD_FOLDER")
	cloudinaryURL := os.Getenv("CLOUDINARY_URL")
	verificationLinkBase := os.Getenv("VERIFICATION_LINK_BASE")
	resetLinkBase := os.Getenv("RESET_LINK_BASE")
	rajaOngkirApiKey := os.Getenv("RAJA_ONGKIR_API_KEY")
	rajaOngkirCostApiUrl := os.Getenv("RAJA_ONGKIR_COST_API_URL")

	return &Config{
		dbUrl:                   dbUrl,
		jwtIss:                  jwtIss,
		jwtLoginExp:             jwtLoginExp,
		jwtSecret:               jwtSecret,
		serverPort:              serverPort,
		hashCost:                hashCost,
		appMailPassword:         appMailPassword,
		defaultEndpointFrontend: defaultEndpointFrontend,
		emailUsernameSender:     emailUsernameSender,
		emailHostSender:         emailHostSender,
		emailPortSender:         emailPortSender,
		cloudinaryCloudName:     cloudinaryCloudName,
		cloudinaryAPIKey:        cloudinaryAPIKey,
		cloudinaryAPISecret:     cloudinaryAPISecret,
		cloudinaryUploadFolder:  cloudinaryUploadFolder,
		cloudinaryURL:           cloudinaryURL,
		tokenLength:             tokenLength,
		randomTokenLength:       randomTokenLength,
		verificationLinkBase:    verificationLinkBase,
		resetLinkBase:           resetLinkBase,
		jwtVerifyDoctorExp:      jwtVerifyDoctorExp,
		jwtVerifyUserExp:        jwtVerifyUserExp,
		jwtRefreshTokenExp:      jwtRefreshTokenExp,
		jwtForgotPasswordExp:    jwtForgotPasswordExp,
		rajaOngkirApiKey:        rajaOngkirApiKey,
		rajaOngkirCostApiUrl:    rajaOngkirCostApiUrl,
	}, nil
}

func (c *Config) DBUrl() string {
	return c.dbUrl
}

func (c *Config) JwtIss() string {
	return c.jwtIss
}

func (c *Config) JwtLoginExp() int {
	return c.jwtLoginExp
}

func (c *Config) JwtSecret() string {
	return c.jwtSecret
}

func (c *Config) ServerPort() string {
	return c.serverPort
}

func (c *Config) HashCost() int {
	return c.hashCost
}

func (c *Config) DefaultPassword() string {
	return c.defaultPassword
}

func (c *Config) AppMailPassword() string {
	return c.appMailPassword
}

func (c *Config) DefaultEndpointFrontend() string {
	return c.defaultEndpointFrontend
}

func (c *Config) EmailUsernameSender() string {
	return c.emailUsernameSender
}

func (c *Config) EmailHostSender() string {
	return c.emailHostSender
}

func (c *Config) EmailPortSender() string {
	return c.emailPortSender
}

func (c *Config) CloudinaryCloudName() string {
	return c.cloudinaryCloudName
}

func (c *Config) CloudinaryURL() string {
	return c.cloudinaryURL
}

func (c *Config) CloudinaryKey() string {
	return c.cloudinaryAPIKey
}

func (c *Config) CloudinarySecret() string {
	return c.cloudinaryAPISecret
}

func (c *Config) CloudinaryFolder() string {
	return c.cloudinaryUploadFolder
}

func (c *Config) TokenLength() int {
	return c.tokenLength
}

func (c *Config) RandomTokenLength() int {
	return c.randomTokenLength
}

func (c *Config) VerificationLinkBase() string {
	return c.verificationLinkBase
}

func (c *Config) ResetLinkBase() string {
	return c.resetLinkBase
}

func (c *Config) JwtVerifyDoctorExpired() int {
	return c.jwtVerifyDoctorExp
}

func (c *Config) JwtVerifyUserExpired() int {
	return c.jwtVerifyUserExp
}

func (c *Config) JwtRefreshTokenExpired() int {
	return c.jwtRefreshTokenExp
}

func (c *Config) JwtForgotPasswordExp() int {
	return c.jwtForgotPasswordExp
}

func (c *Config) RajaOngkirApiKey() string {
	return c.rajaOngkirApiKey
}

func (c *Config) RajaOngkirCostApiUrl() string {
	return c.rajaOngkirCostApiUrl
}
