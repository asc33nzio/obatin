package usecase

import (
	"context"
	"fmt"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/config"
	"strings"
	"time"

	"obatin/entity"
	"obatin/repository"
	"obatin/util"
)

type AuthenticationUsecase interface {
	Login(ctx context.Context, uReq entity.Authentication, isExtended bool) (*entity.AuthenticationToken, error)
	RegisterDoctor(ctx context.Context, uReq entity.Authentication) error
	VerifyEmail(ctx context.Context, token string) error
	RegisterUser(ctx context.Context, uReq entity.Authentication) error
	SendVerificationEmail(ctx context.Context) error
	UpdatePasswordWithToken(ctx context.Context, uReq entity.Authentication, token string) error
	UpdatePassword(ctx context.Context, updateReq entity.UpdatePassword) error
	UpdateApproval(ctx context.Context, authenticationId int, isApprove bool) error
	SendEmailForgotPasssword(ctx context.Context, uReq entity.Authentication) error
	ResendVerificationEmail(ctx context.Context, email string) error
	GetPendingDoctorApproval(ctx context.Context, params entity.Pagination) (*entity.DoctorApprovalPage, error)
	GenerateRefreshToken(ctx context.Context, refreshToken string) (*entity.AuthenticationToken, error)
	GetDoctorById(ctx context.Context, doctorId int64) (*entity.DoctorDetail, error)
	GetUserById(ctx context.Context, userId int64) (*entity.User, error)
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

func (u *authentictionUsecaseImpl) Login(ctx context.Context, uReq entity.Authentication, isExtended bool) (*entity.AuthenticationToken, error) {
	ur := u.repoStore.AuthenticationRepository()
	rt := u.repoStore.RefreshTokenRepository()
	dr := u.repoStore.DoctorRepository()

	isPasswordValid := appvalidator.IsValidPassword(uReq.Password)
	if !isPasswordValid {
		return nil, apperror.ErrInvalidPassword(apperror.ErrStlInvalidPassword)
	}

	isValidEmailFormat := appvalidator.IsValidEmail(uReq.Email)
	if !isValidEmailFormat {
		return nil, apperror.ErrInvalidEmail(apperror.ErrStlInvalidEmail)
	}

	authentication, err := ur.FindAuthenticationByEmail(ctx, uReq.Email)
	if err != nil {
		return nil, err
	}

	err = u.cryptoHash.CheckPassword(uReq.Password, []byte(authentication.Password))
	if err != nil {
		return nil, apperror.ErrWrongPassword(err)
	}

	token, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{
			AuthenticationId: authentication.Id,
			Role:             authentication.Role,
			IsVerified:       authentication.IsVerified,
			IsApproved:       authentication.IsApproved,
		},
		u.config.JwtLoginExp(),
		u.config.JwtSecret(),
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	if authentication.Role == appconstant.RoleDoctor {
		onlineStatus := appconstant.DoctorOnlineTrue
		_, err = dr.UpdateOneDoctor(ctx, entity.DoctorUpdateRequest{
			IsOnline: &onlineStatus,
		}, authentication.Id)
		if err != nil {
			return nil, err
		}
	}

	err = rt.DeleteRefreshTokenAfterExpiredByAuthId(ctx, authentication.Id)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	isRefreshTokenValid, err := rt.IsRefreshTokenValidByEmail(ctx, uReq.Email)
	if err != nil {
		return nil, err
	}

	refreshTokenValidDurationMinutes := u.config.JwtRefreshTokenExpired()
	if isExtended {
		refreshTokenValidDurationMinutes *= 2
	}

	if !isRefreshTokenValid {
		randomRefreshToken, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
		if err != nil {
			return nil, err
		}
		randomRefreshTokenJWT, err := u.jwtAuth.CreateAndSign(
			util.JWTPayload{
				RandomToken:      randomRefreshToken,
				Role:             authentication.Role,
				AuthenticationId: authentication.Id},
			refreshTokenValidDurationMinutes,
			u.config.JwtSecret(),
		)

		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		refreshTokenValidUntil := time.Now().Add(time.Duration(refreshTokenValidDurationMinutes) * time.Minute)
		err = rt.CreateNewRefreshToken(ctx, randomRefreshToken, authentication.Id, &refreshTokenValidUntil)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		authenticationToken := entity.AuthenticationToken{
			AccessToken:  token,
			RefreshToken: randomRefreshTokenJWT,
		}

		return &authenticationToken, nil
	}

	refreshToken, err := rt.GetByEmail(ctx, uReq.Email)
	if err != nil {
		return nil, err
	}
	existingRefreshTokenJWT, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{
			RandomToken:      refreshToken.RefreshToken,
			Role:             authentication.Role,
			AuthenticationId: authentication.Id},
		refreshTokenValidDurationMinutes,
		u.config.JwtSecret(),
	)
	if err != nil {
		return nil, err
	}

	authenticationToken := entity.AuthenticationToken{
		AccessToken:  token,
		RefreshToken: existingRefreshTokenJWT,
	}

	return &authenticationToken, nil
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

		defaultPassword, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
		if err != nil {
			return nil, err
		}
		for !appvalidator.IsValidPassword(defaultPassword) {
			defaultPassword, err = u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
			if err != nil {
				return nil, err
			}
		}
		hashedPass, err := u.cryptoHash.HashPassword(defaultPassword, u.config.HashCost())
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		uReq.Password = string(hashedPass)
		uReq.Role = appconstant.RoleDoctor
		uReq.IsApproved = appconstant.HasNotApproved

		user, err := ar.CreateOne(ctx, uReq)
		if err != nil {
			return nil, err
		}

		uploadUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, uReq.Certificate)
		if err != nil {
			return "", apperror.NewInternal(err)
		}

		err = dr.CreateNewDoctor(ctx, user.Id, uploadUrl, int(uReq.SpecializationID))
		if err != nil {
			return nil, err
		}

		emailParamsRegisterDoctor := util.EmailParams{
			ToEmail:          user.Email,
			VerificationLink: "",
			IsAccepted:       appconstant.IsNotAccepted,
			DefaultPassword:  defaultPassword,
			IsForgotPassword: appconstant.IsNotForgotPassword,
			IsReverified:     appconstant.IsNotReverified,
		}

		err = u.sendEmail.SendVerificationEmail(emailParamsRegisterDoctor)
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
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
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
		uReq.Role = appconstant.RoleUser
		uReq.IsApproved = appconstant.HasApproved
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
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	return nil
}

func (u *authentictionUsecaseImpl) VerifyEmail(ctx context.Context, token string) error {
	ur := u.repoStore.AuthenticationRepository()

	claims, err := u.jwtAuth.ParseAndVerify(token, u.config.JwtSecret())
	if err != nil {
		return apperror.ErrInvalidToken(err)
	}

	isTokenHasUsed, err := ur.IsTokenHasUsed(ctx, claims.Payload.RandomToken)
	if err != nil {
		return apperror.ErrInvalidToken(err)
	}

	if isTokenHasUsed {
		return apperror.ErrInvalidToken(nil)
	}

	_, err = ur.VerifyEmail(ctx, claims.Payload.RandomToken)
	if err != nil {
		return err
	}

	return nil
}

func (u *authentictionUsecaseImpl) SendVerificationEmail(ctx context.Context) error {
	authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}
	authenticationRole, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}
	ar := u.repoStore.AuthenticationRepository()

	token, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
	if err != nil {
		return err
	}

	tokenJWT, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{RandomToken: token, Role: authenticationRole},
		u.config.JwtVerifyUserExpired(),
		u.config.JwtSecret(),
	)
	if err != nil {
		return err
	}

	authentication, err := ar.UpdateToken(ctx, token, int(authenticationId))
	if err != nil {
		return err
	}

	verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpointFrontend(), u.config.VerificationLinkBase(), tokenJWT)

	emailParamsVerificationEmail := util.EmailParams{
		ToEmail:          authentication.Email,
		VerificationLink: verificationLink,
		IsAccepted:       appconstant.IsAccepted,
		DefaultPassword:  "",
		IsForgotPassword: appconstant.IsNotForgotPassword,
		IsReverified:     appconstant.IsNotReverified,
	}
	err = u.sendEmail.SendVerificationEmail(emailParamsVerificationEmail)
	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}

func (u *authentictionUsecaseImpl) UpdatePasswordWithToken(ctx context.Context, uReq entity.Authentication, token string) error {
	ur := u.repoStore.AuthenticationRepository()
	rpr := u.repoStore.ResetPasswordRepository()

	claims, err := u.jwtAuth.ParseAndVerify(token, u.config.JwtSecret())
	if err != nil {
		if strings.Contains(err.Error(), appconstant.ErrorTokenIsExpired) {
			err := rpr.DeleteResetPasswordTokenAfterExpired(ctx)
			if err != nil {
				return err
			}
			return apperror.ErrTokenHasExpired(err)
		}
		return apperror.ErrInvalidToken(err)
	}

	isPasswordValid := appvalidator.IsValidPassword(uReq.Password)
	if !isPasswordValid {
		return apperror.ErrInvalidPassword(apperror.ErrStlInvalidPassword)
	}

	isPasswordConfirmMatch := appvalidator.CheckConfirmPassword(uReq.Password, uReq.ConfirmPassword)
	if !isPasswordConfirmMatch {
		return apperror.ErrConfirmPasswordNotMatch(apperror.ErrStlConfirmPasswordNotMatch)
	}

	isTokenResetHasUsed, err := rpr.IsTokenResetHasUsed(ctx, claims.Payload.RandomToken)
	if err != nil {
		return err
	}
	if isTokenResetHasUsed {
		return apperror.ErrTokenHasBeenUsedBefore(nil)
	}

	resetPassword, err := rpr.GetByToken(ctx, claims.Payload.RandomToken)
	if err != nil {
		return err
	}

	hashedPass, err := u.cryptoHash.HashPassword(uReq.Password, u.config.HashCost())
	if err != nil {
		return apperror.NewInternal(err)
	}

	uReq.Password = string(hashedPass)

	_, err = ur.UpdatePasswordByEmail(ctx, uReq.Password, resetPassword.Email)
	if err != nil {
		return err
	}

	err = rpr.DeleteResetPasswordTokenAfterUsed(ctx, claims.Payload.RandomToken)
	if err != nil {
		return err
	}

	return nil
}

func (u *authentictionUsecaseImpl) UpdatePassword(ctx context.Context, updateReq entity.UpdatePassword) error {
	ar := u.repoStore.AuthenticationRepository()

	authId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	if updateReq.NewPassword == updateReq.OldPassword {
		return apperror.ErrInvalidSameUpdatedPassword(nil)
	}

	authProfile, err := ar.FindAuthenticationById(ctx, int64(authId))
	if err != nil {
		return err
	}
	profilePass, err := ar.FindAuthenticationByEmail(ctx, authProfile.Email)
	if err != nil {
		return err
	}

	err = u.cryptoHash.CheckPassword(updateReq.OldPassword, []byte(profilePass.Password))
	if err != nil {
		return apperror.ErrWrongPassword(apperror.ErrStlInvalidPassword)
	}

	isPasswordValid := appvalidator.IsValidPassword(updateReq.NewPassword)
	if !isPasswordValid {
		return apperror.ErrInvalidPassword(apperror.ErrStlInvalidPassword)
	}

	hashedPass, err := u.cryptoHash.HashPassword(updateReq.NewPassword, u.config.HashCost())
	if err != nil {
		return apperror.NewInternal(err)
	}

	_, err = ar.UpdatePasswordByEmail(ctx, string(hashedPass), authProfile.Email)
	if err != nil {
		return err
	}

	return nil
}

func (u *authentictionUsecaseImpl) UpdateApproval(ctx context.Context, authenticationId int, isApprove bool) error {
	ar := u.repoStore.AuthenticationRepository()
	authenticationRole, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	if authenticationRole != appconstant.RoleAdmin {
		return apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
	}

	_, err := ar.UpdateApproval(ctx, authenticationId, isApprove)
	if err != nil {
		return err
	}

	token, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
	if err != nil {
		return err
	}

	tokenJWT, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{RandomToken: token},
		u.config.JwtVerifyDoctorExpired(),
		u.config.JwtSecret(),
	)
	if err != nil {
		return err
	}

	foundUser, err := ar.GetById(ctx, int(authenticationId))
	if err != nil {
		return apperror.NewInternal(err)
	}

	authentication, err := ar.UpdateToken(ctx, token, int(authenticationId))
	if err != nil {
		verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpointFrontend(), u.config.VerificationLinkBase(), tokenJWT)

		emailParamsApprovalRejected := util.EmailParams{
			ToEmail:          foundUser.Email,
			VerificationLink: verificationLink,
			IsAccepted:       appconstant.IsNotAccepted,
			DefaultPassword:  "",
			IsForgotPassword: appconstant.IsNotForgotPassword,
			IsReverified:     appconstant.IsNotReverified,
		}
		err = u.sendEmail.SendVerificationEmail(emailParamsApprovalRejected)
		if err != nil {
			return apperror.NewInternal(err)
		}
		return apperror.NewInternal(err)
	}

	verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpointFrontend(), u.config.VerificationLinkBase(), tokenJWT)

	emailParamsApprovalAccepted := util.EmailParams{
		ToEmail:          authentication.Email,
		VerificationLink: verificationLink,
		IsAccepted:       appconstant.IsAccepted,
		DefaultPassword:  "",
		IsForgotPassword: appconstant.IsNotForgotPassword,
		IsReverified:     appconstant.IsNotReverified,
	}
	err = u.sendEmail.SendVerificationEmail(emailParamsApprovalAccepted)
	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}

func (u *authentictionUsecaseImpl) SendEmailForgotPasssword(ctx context.Context, uReq entity.Authentication) error {

	ar := u.repoStore.AuthenticationRepository()
	rpr := u.repoStore.ResetPasswordRepository()

	isValidEmailFormat := appvalidator.IsValidEmail(uReq.Email)
	if !isValidEmailFormat {
		return apperror.ErrInvalidEmail(apperror.ErrStlInvalidEmail)
	}

	isEmailExist, err := ar.IsEmailExist(ctx, uReq.Email)
	if err != nil {
		return err
	}

	if !isEmailExist {
		return apperror.ErrEmailNotRegistered(nil)
	}

	isApprove, err := ar.IsApproved(ctx, uReq.Email)
	if err != nil {
		return err
	}
	if !isApprove {
		return apperror.ErrAccountNotApproved(apperror.ErrStlAccountHasNotApproved)
	}

	isUserVerified, err := ar.IsVerified(ctx, uReq.Email)
	if err != nil {
		return err
	}

	if !isUserVerified {
		err = u.ResendVerificationEmail(ctx, uReq.Email)
		if err != nil {
			return err
		}
	}

	err = rpr.DeleteResetPasswordTokenAfterExpired(ctx)
	if err != nil {
		return err
	}

	isUserHaveValidToken, err := rpr.IsUserStillHaveValidToken(ctx, uReq.Email)
	if err != nil {
		return err
	}
	if isUserHaveValidToken {

		resetPassword, err := rpr.GetByEmail(ctx, uReq.Email)
		if err != nil {
			return err
		}
		tokenJWT, err := u.jwtAuth.CreateAndSign(
			util.JWTPayload{RandomToken: resetPassword.Token},
			u.config.JwtForgotPasswordExp(),
			u.config.JwtSecret(),
		)
		if err != nil {
			return err
		}

		verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpointFrontend(), u.config.ResetLinkBase(), tokenJWT)
		emailParamsResetPassword := util.EmailParams{
			ToEmail:          uReq.Email,
			VerificationLink: verificationLink,
			IsAccepted:       appconstant.IsAccepted,
			DefaultPassword:  "",
			IsForgotPassword: appconstant.IsForgotPassword,
			IsReverified:     appconstant.IsNotReverified,
		}
		err = u.sendEmail.SendVerificationEmail(emailParamsResetPassword)
		if err != nil {
			return apperror.NewInternal(err)
		}

		return nil
	}

	token, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
	if err != nil {
		return err
	}

	tokenJWT, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{RandomToken: token},
		u.config.JwtForgotPasswordExp(),
		u.config.JwtSecret(),
	)

	if err != nil {
		return err
	}

	err = rpr.CreateNewResetPassword(ctx, token, uReq.Email)
	if err != nil {
		return err
	}

	verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpointFrontend(), u.config.ResetLinkBase(), tokenJWT)

	emailParamsResetPassword := util.EmailParams{
		ToEmail:          uReq.Email,
		VerificationLink: verificationLink,
		IsAccepted:       appconstant.IsAccepted,
		DefaultPassword:  "",
		IsForgotPassword: appconstant.IsForgotPassword,
		IsReverified:     appconstant.IsNotReverified,
	}
	err = u.sendEmail.SendVerificationEmail(emailParamsResetPassword)
	if err != nil {
		return apperror.NewInternal(err)
	}

	return nil
}

func (u *authentictionUsecaseImpl) ResendVerificationEmail(ctx context.Context, email string) error {
	ar := u.repoStore.AuthenticationRepository()

	user, err := ar.FindAuthenticationByEmail(ctx, email)
	if err != nil {
		return err
	}

	token, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
	if err != nil {
		return err
	}
	tokenJWT, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{RandomToken: token, Role: user.Role},
		u.config.JwtVerifyUserExpired(),
		u.config.JwtSecret(),
	)
	if err != nil {
		return err
	}
	authentication, err := ar.UpdateToken(ctx, token, int(user.Id))
	if err != nil {
		return err
	}

	verificationLink := fmt.Sprintf("%s%s%s", u.config.DefaultEndpointFrontend(), u.config.VerificationLinkBase(), tokenJWT)

	emailParamsResendVerification := util.EmailParams{
		ToEmail:          authentication.Email,
		VerificationLink: verificationLink,
		IsAccepted:       appconstant.IsAccepted,
		DefaultPassword:  "",
		IsForgotPassword: appconstant.IsNotForgotPassword,
		IsReverified:     appconstant.IsReverified,
	}

	err = u.sendEmail.SendVerificationEmail(emailParamsResendVerification)
	if err != nil {
		return apperror.NewInternal(err)
	}

	return apperror.ErrEmailNotVerified(apperror.ErrStlEmailNotVerified)
}

func (u *authentictionUsecaseImpl) GetPendingDoctorApproval(ctx context.Context, params entity.Pagination) (*entity.DoctorApprovalPage, error) {
	drr := u.repoStore.AuthenticationRepository()
	if params.Limit < appconstant.DefaultMinLimit {
		params.Limit = appconstant.DefaultProductLimit
	}
	if params.Page < appconstant.DefaultMinPage {
		params.Page = appconstant.DefaultMinPage
	}

	authenticationRole, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	if authenticationRole != appconstant.RoleAdmin {
		return nil, apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
	}

	doctorPendingApproval, err := drr.GetPendingDoctorApproval(ctx, params)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	doctorPendingApproval.Pagination = entity.PaginationResponse{
		Page:         params.Page,
		PageCount:    int64(doctorPendingApproval.TotalRows) / int64(params.Limit),
		Limit:        params.Limit,
		TotalRecords: int64(doctorPendingApproval.TotalRows),
	}
	if doctorPendingApproval.Pagination.PageCount < appconstant.DefaultMinPage {
		doctorPendingApproval.Pagination.PageCount = appconstant.DefaultMinPage
	}
	if doctorPendingApproval.Pagination.TotalRecords-(doctorPendingApproval.Pagination.PageCount*int64(params.Limit)) > 0 {
		doctorPendingApproval.Pagination.PageCount = int64(doctorPendingApproval.Pagination.PageCount) + appconstant.DefaultMinPage
	}

	return doctorPendingApproval, nil
}

func (u *authentictionUsecaseImpl) GenerateRefreshToken(ctx context.Context, refreshToken string) (*entity.AuthenticationToken, error) {
	rt := u.repoStore.RefreshTokenRepository()
	ar := u.repoStore.AuthenticationRepository()

	claims, err := u.jwtAuth.ParseAndVerify(refreshToken, u.config.JwtSecret())
	if err != nil {
		return nil, apperror.ErrInvalidToken(err)
	}

	isRefreshTokenValid, err := rt.IsRefreshTokenValidByToken(ctx, claims.Payload.RandomToken)
	if err != nil {
		return nil, err
	}

	if !isRefreshTokenValid {
		return nil, apperror.ErrTokenHasExpired(nil)
	}

	authentication, err := ar.FindAuthenticationById(ctx, claims.Payload.AuthenticationId)
	if err != nil {
		return nil, err
	}

	newAccessToken, err := u.jwtAuth.CreateAndSign(
		util.JWTPayload{
			AuthenticationId: authentication.Id,
			IsVerified:       authentication.IsVerified,
			IsApproved:       authentication.IsApproved,
			Role:             authentication.Role,
		},
		u.config.JwtLoginExp(),
		u.config.JwtSecret(),
	)
	if err != nil {
		return nil, apperror.ErrInvalidToken(err)
	}

	authenticationToken := entity.AuthenticationToken{
		AccessToken: newAccessToken,
	}

	return &authenticationToken, nil

}

func (u *authentictionUsecaseImpl) GetDoctorById(ctx context.Context, doctorId int64) (*entity.DoctorDetail, error) {
	dr := u.repoStore.DoctorRepository()

	doctor, err := dr.FindDoctorDetailById(ctx, doctorId)
	if err != nil {
		return nil, err
	}

	return doctor, nil

}

func (u *authentictionUsecaseImpl) GetUserById(ctx context.Context, userId int64) (*entity.User, error) {
	ur := u.repoStore.UserRepository()

	user, err := ur.FindUserById(ctx, userId)
	if err != nil {
		return nil, err
	}

	return user, nil

}
