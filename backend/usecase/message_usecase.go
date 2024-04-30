package usecase

import (
	"context"
	"obatin/apperror"
	"obatin/config"
	"obatin/constant"
	"obatin/entity"
	"obatin/repository"
	"obatin/util"
)

type MessageUsecase interface {
	CreateMessage(ctx context.Context, uReq entity.Message) error
}

type messageUsecaseImpl struct {
	repoStore        repository.RepoStore
	cryptoHash       util.CryptoHashItf
	jwtAuth          util.JWTItf
	config           *config.Config
	tokenGenerator   util.TokenGeneratorItf
	cloudinaryUpload util.CloudinaryItf
	sendEmail        util.SendEmailItf
}

func NewMessageUsecaseImpl(
	repoStore repository.RepoStore,
	cryptoHash util.CryptoHashItf,
	jwtAuth util.JWTItf,
	config *config.Config,
	tokenGenerator util.TokenGeneratorItf,
	cloudinaryUpload util.CloudinaryItf,
	sendEmail util.SendEmailItf,
) *messageUsecaseImpl {
	return &messageUsecaseImpl{
		repoStore:        repoStore,
		cryptoHash:       cryptoHash,
		jwtAuth:          jwtAuth,
		config:           config,
		tokenGenerator:   tokenGenerator,
		cloudinaryUpload: cloudinaryUpload,
		sendEmail:        sendEmail,
	}
}

func (u *messageUsecaseImpl) CreateMessage(ctx context.Context, mReq entity.Message) error {
	mr := u.repoStore.MessageRepository()
	ur := u.repoStore.UserRepository()
	dr := u.repoStore.DoctorRepository()
	crr := u.repoStore.ChatRoomRepository()
	authenticationRole, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}
	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	err := crr.DeleteChatRoomAfterExpired(ctx)
	if err != nil {
		return apperror.NewInternal(err)
	}

	chatRoom, err := crr.FindChatRoomByID(ctx, mReq.ChatRoomId)
	if err != nil {
		return err
	}

	if !chatRoom.IsActive {
		return apperror.ErrChatRoomAlreadyInactive(nil)
	}

	if authenticationRole == constant.RoleDoctor {
		doctor, err := dr.FindDoctorByAuthId(ctx, authenticationId)
		if err != nil {
			return err
		}

		if chatRoom.DoctorId != doctor.Id {
			return apperror.ErrForbiddenAccess(nil)
		}
	}

	if authenticationRole == constant.RoleUser {
		user, err := ur.FindUserByAuthId(ctx, authenticationId)
		if err != nil {
			return err
		}
		if chatRoom.UserId != *user.Id {
			return apperror.ErrForbiddenAccess(nil)
		}
	}

	mReq.Sender = authenticationRole
	err = mr.CreateMessage(ctx, mReq)
	if err != nil {
		return apperror.ErrInvalidReq(nil)
	}

	return nil
}
