package usecase

import (
	"context"
	"fmt"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/config"
	"obatin/constant"
	"obatin/entity"
	"obatin/repository"
	"obatin/util"
)

type AuthenticationUsecase interface {
	Login(ctx context.Context, uReq entity.Authentication) (string, error)
	RegisterDoctor(ctx context.Context, uReq entity.Authentication) error
	VerifiedEmail(ctx context.Context, token string) error
	RegisterUser(ctx context.Context, uReq entity.Authentication) error
	SendVerifiedEmail(ctx context.Context) error
	UpdatePassword(ctx context.Context, uReq entity.Authentication, token string) error
	UpdateApproval(ctx context.Context, authenticationId int, isApprove bool) (*entity.Authentication, error)
}

type authentictionUsecaseImpl struct {
	repoStore        repository.RepoStore
	cryptoHash       util.CryptoHashItf
	jwtAuth          util.JWTItf
	config           *config.Config
	tokenGenerator   util.TokenGeneratorItf
	cloudinaryUpload util.CloudinaryItf
	sendEmail        util.SendEmailItf
}

func NewAuthenticationUsecaseImpl(
	repoStore repository.RepoStore,
	cryptoHash util.CryptoHashItf,
	jwtAuth util.JWTItf,
	config *config.Config,
	tokenGenerator util.TokenGeneratorItf,
	cloudinaryUpload util.CloudinaryItf,
	sendEmail util.SendEmailItf,
) *authentictionUsecaseImpl {
	return &authentictionUsecaseImpl{
		repoStore:        repoStore,
		cryptoHash:       cryptoHash,
		jwtAuth:          jwtAuth,
		config:           config,
		tokenGenerator:   tokenGenerator,
		cloudinaryUpload: cloudinaryUpload,
		sendEmail:        sendEmail,
	}
}

func (u *authentictionUsecaseImpl) Login(ctx context.Context, uReq entity.Authentication) (string, error) {
	ur := u.repoStore.AuthenticationRepository()

	user, err := ur.FindUserByEmail(ctx, uReq.Email)
	if err != nil {
		return "", err
	}

	err = u.cryptoHash.CheckPassword(uReq.Password, []byte(user.Password))
	if err != nil {
		return "", apperror.ErrWrongPassword(err)
	}

	token, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{UserId: user.Id, Role: user.Role},
		u.config.JwtLoginExp(),
		u.config.JwtSecret(),
	)
	if err != nil {
		return "", apperror.NewInternal(err)
	}

	return token, nil
}

func (u *authentictionUsecaseImpl) RegisterDoctor(ctx context.Context, uReq entity.Authentication) error {
	res, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ar := rs.AuthenticationRepository()
		dr := rs.DoctorRepository()

		isEmailExist, err := ar.IsEmailExist(ctx, uReq.Email)
		if err != nil {
			return nil, err
		}

		if isEmailExist {
			return nil, apperror.ErrEmailAlreadyRegistered(nil)
		}

		isValidEmailFormat := appvalidator.IsValidEmail(uReq.Email)
		if !isValidEmailFormat {
			return nil, apperror.ErrInvalidEmail(apperror.ErrStlInvalidEmail)
		}

		hashedPass, err := u.cryptoHash.HashPassword(u.config.DefaultPassword(), u.config.HashCost())
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		uReq.Password = string(hashedPass)
		uReq.Role = constant.RoleDoctor
		uReq.IsApproved = constant.HasNotApproved

		user, err := ar.CreateOne(ctx, uReq)
		if err != nil {
			return nil, err
		}

		uploadUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, uReq.Certificate)
		if err != nil {
			return "", err
		}

		err = dr.CreateNewDoctor(ctx, user.Id, uploadUrl)
		if err != nil {
			return nil, err
		}

		err = u.sendEmail.SendVerificationEmail(user.Email, "", false, u.config.DefaultPassword())
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		return user, nil
	})
	if err != nil {
		return err
	}

	_, ok := res.(*entity.Authentication)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	return nil
}

func (u *authentictionUsecaseImpl) RegisterUser(ctx context.Context, uReq entity.Authentication) error {
	res, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ar := rs.AuthenticationRepository()
		ur := rs.UserRepository()

		isEmailExist, err := ar.IsEmailExist(ctx, uReq.Email)
		if err != nil {
			return nil, err
		}

		isValidEmailFormat := appvalidator.IsValidEmail(uReq.Email)
		if !isValidEmailFormat {
			return nil, apperror.ErrInvalidEmail(apperror.ErrStlInvalidEmail)
		}

		isPasswordValid := appvalidator.IsValidPassword(uReq.Password)
		if !isPasswordValid {
			return nil, apperror.ErrInvalidPassword(apperror.ErrStlInvalidPassword)
		}

		if isEmailExist {
			return nil, apperror.ErrEmailAlreadyRegistered(nil)
		}

		hashedPass, err := u.cryptoHash.HashPassword(uReq.Password, u.config.HashCost())
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		uReq.Password = string(hashedPass)
		uReq.Role = constant.RoleUser
		uReq.IsApproved = constant.HasApproved
		user, err := ar.CreateOne(ctx, uReq)
		if err != nil {
			return nil, err
		}

		err = ur.CreateNewUser(ctx, user.Id)
		if err != nil {
			return nil, err
		}

		return user, nil
	})

	if err != nil {
		return err
	}

	_, ok := res.(*entity.Authentication)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	return nil
}

func (u *authentictionUsecaseImpl) VerifiedEmail(ctx context.Context, token string) error {
	ur := u.repoStore.AuthenticationRepository()

	claims, err := u.jwtAuth.ParseAndVerify(token, u.config.JwtSecret())
	if err != nil {
		return apperror.ErrInvalidToken(err)
	}

	_, err = ur.VerifiedEmail(ctx, claims.Payload.RandomToken)
	if err != nil {
		return err
	}

	return nil
}

func (u *authentictionUsecaseImpl) SendVerifiedEmail(ctx context.Context) error {
	authenticationId := ctx.Value(constant.AuthenticationIdKey).(int64)
	ar := u.repoStore.AuthenticationRepository()

	token, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
	if err != nil {
		return err
	}

	tokenJWT, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{RandomToken: token},
		u.config.JWTVerifyUserExpired(),
		u.config.JwtSecret(),
	)
	if err != nil {
		return err
	}

	authentication, err := ar.UpdateToken(ctx, token, int(authenticationId))
	if err != nil {
		return err
	}

	verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpoint(), u.config.VerificationLinkBase(), tokenJWT)
	err = u.sendEmail.SendVerificationEmail(authentication.Email, verificationLink, true, "")
	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}

func (u *authentictionUsecaseImpl) UpdatePassword(ctx context.Context, uReq entity.Authentication, token string) error {
	ur := u.repoStore.AuthenticationRepository()

	isPasswordValid := appvalidator.IsValidPassword(uReq.Password)
	if !isPasswordValid {
		return apperror.ErrInvalidPassword(apperror.ErrStlInvalidPassword)
	}

	hashedPass, err := u.cryptoHash.HashPassword(uReq.Password, u.config.HashCost())
	if err != nil {
		return apperror.NewInternal(err)
	}

	claims, err := u.jwtAuth.ParseAndVerify(token, u.config.JwtSecret())
	if err != nil {
		return apperror.ErrInvalidToken(err)
	}

	uReq.Password = string(hashedPass)

	_, err = ur.UpdatePassword(ctx, uReq.Password, claims.Payload.RandomToken)
	if err != nil {
		return err
	}

	return nil
}

func (u *authentictionUsecaseImpl) UpdateApproval(ctx context.Context, authenticationId int, isApprove bool) (*entity.Authentication, error) {
	ar := u.repoStore.AuthenticationRepository()

	user, err := ar.UpdateApproval(ctx, authenticationId, isApprove)
	if err != nil {
		return nil, err
	}

	token, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
	if err != nil {
		return nil, err
	}

	tokenJWT, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{RandomToken: token},
		u.config.JWTVerifyDoctorExpired(),
		u.config.JwtSecret(),
	)
	if err != nil {
		return nil, err
	}

	foundUser, err := ar.GetById(ctx, int(authenticationId))
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	authentication, err := ar.UpdateToken(ctx, token, int(authenticationId))
	if err != nil {
		verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpoint(), u.config.VerificationLinkBase(), tokenJWT)
		err = u.sendEmail.SendVerificationEmail(foundUser.Email, verificationLink, false, "")
		if err != nil {
			return nil, apperror.NewInternal(err)
		}
		return nil, err
	}

	verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpoint(), u.config.VerificationLinkBase(), tokenJWT)
	err = u.sendEmail.SendVerificationEmail(authentication.Email, verificationLink, true, "")
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return user, nil
}
