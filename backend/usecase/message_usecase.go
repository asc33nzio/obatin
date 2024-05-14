package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
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
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		mr := rs.MessageRepository()
		ur := rs.UserRepository()
		dr := rs.DoctorRepository()
		crr := rs.ChatRoomRepository()

		authenticationRole, ok := ctx.Value(appconstant.AuthenticationRole).(string)
		if !ok {
			return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
		}
		authenticationId, ok := ctx.Value(appconstant.AuthenticationIdKey).(int64)
		if !ok {
			return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
		}

		err := crr.DeleteChatRoomAfterExpiredById(ctx, mReq.ChatRoomId)
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		chatRoom, err := crr.FindChatRoomByID(ctx, mReq.ChatRoomId)
		if err != nil {
			return nil, err
		}

		if !chatRoom.IsActive {
			return nil, apperror.ErrChatRoomAlreadyInactive(nil)
		}

		if authenticationRole == appconstant.RoleDoctor {
			doctor, err := dr.FindDoctorByAuthId(ctx, authenticationId)
			if err != nil {
				return nil, err
			}

			if chatRoom.DoctorId != doctor.Id {
				return nil, apperror.ErrForbiddenAccess(nil)
			}
		}

		if authenticationRole == appconstant.RoleUser {
			user, err := ur.FindUserByAuthId(ctx, authenticationId)
			if err != nil {
				return nil, err
			}
			if chatRoom.UserId != *user.Id {
				return nil, apperror.ErrForbiddenAccess(nil)
			}
		}

		mReq.Sender = authenticationRole
		err = mr.CreateMessage(ctx, mReq)
		if err != nil {
			return nil, apperror.ErrInvalidReq(nil)
		}
		err = crr.UpdateChatRoomUpdatedAtByID(ctx, chatRoom.Id)
		if err != nil {
			return nil, apperror.ErrInvalidReq(nil)
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}
