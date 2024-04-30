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

type ChatRoomUsecase interface {
	CreateChatRoom(ctx context.Context, uReq entity.ChatRoom) error
	GetAllChatRoomMessageById(ctx context.Context, chatRoomId int64) ([]entity.Message, error)
	UpdateIsTyping(ctx context.Context, crReq entity.ChatRoom, chatRoomId int64) error
	GetAllMessage(ctx context.Context) ([]entity.ChatRoom, error)
	GetChatRoomById(ctx context.Context, chatRoomId int64) (*entity.ChatRoom, error)
	DeleteChatRoom(ctx context.Context, chatRoomId int64) error
}

type chatRoomUsecaseImpl struct {
	repoStore        repository.RepoStore
	cryptoHash       util.CryptoHashItf
	jwtAuth          util.JWTItf
	config           *config.Config
	tokenGenerator   util.TokenGeneratorItf
	cloudinaryUpload util.CloudinaryItf
	sendEmail        util.SendEmailItf
}

func NewChatRoomUsecaseImpl(
	repoStore repository.RepoStore,
	cryptoHash util.CryptoHashItf,
	jwtAuth util.JWTItf,
	config *config.Config,
	tokenGenerator util.TokenGeneratorItf,
	cloudinaryUpload util.CloudinaryItf,
	sendEmail util.SendEmailItf,
) *chatRoomUsecaseImpl {
	return &chatRoomUsecaseImpl{
		repoStore:        repoStore,
		cryptoHash:       cryptoHash,
		jwtAuth:          jwtAuth,
		config:           config,
		tokenGenerator:   tokenGenerator,
		cloudinaryUpload: cloudinaryUpload,
		sendEmail:        sendEmail,
	}
}

func (u *chatRoomUsecaseImpl) CreateChatRoom(ctx context.Context, crReq entity.ChatRoom) error {
	crr := u.repoStore.ChatRoomRepository()
	dr := u.repoStore.DoctorRepository()
	ur := u.repoStore.UserRepository()

	authenticationRole, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	if authenticationRole != constant.RoleUser {
		return apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
	}

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	user, err := ur.FindUserByAuthId(ctx, authenticationId)
	if err != nil {
		return err
	}

	crReq.UserId = *user.Id

	_, err = ur.FindUserById(ctx, crReq.UserId)
	if err != nil {
		return err
	}

	_, err = dr.FindDoctorDetailById(ctx, crReq.DoctorId)
	if err != nil {
		return err
	}

	isChatRoomExist, err := crr.IsChatRoomExist(ctx, crReq.UserId, crReq.DoctorId)
	if err != nil {
		return err
	}

	if isChatRoomExist {
		return apperror.ErrChatRoomAlreadyExist(nil)
	}

	err = crr.CreateOne(ctx, crReq)
	if err != nil {
		return err
	}

	return nil
}

func (u *chatRoomUsecaseImpl) GetAllChatRoomMessageById(ctx context.Context, chatRoomId int64) ([]entity.Message, error) {
	ur := u.repoStore.UserRepository()
	dr := u.repoStore.DoctorRepository()
	mr := u.repoStore.MessageRepository()
	crr := u.repoStore.ChatRoomRepository()

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	authenticationRole, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	chatRoom, err := crr.FindChatRoomByID(ctx, chatRoomId)
	if err != nil {
		return nil, err
	}

	if authenticationRole == constant.RoleDoctor {
		doctor, err := dr.FindDoctorByAuthId(ctx, authenticationId)
		if err != nil {
			return nil, err
		}

		if chatRoom.DoctorId != doctor.Id {
			return nil, apperror.ErrForbiddenAccess(nil)
		}
	}

	if authenticationRole == constant.RoleUser {
		user, err := ur.FindUserByAuthId(ctx, authenticationId)
		if err != nil {
			return nil, err
		}
		if chatRoom.UserId != *user.Id {
			return nil, apperror.ErrForbiddenAccess(nil)
		}
	}

	allMessageInChatRoom, err := mr.GetAllMessagesByChatRoomId(ctx, chatRoomId)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	return allMessageInChatRoom, nil
}

func (u *chatRoomUsecaseImpl) UpdateIsTyping(ctx context.Context, crReq entity.ChatRoom, chatRoomId int64) error {
	crr := u.repoStore.ChatRoomRepository()
	ur := u.repoStore.UserRepository()
	dr := u.repoStore.DoctorRepository()

	authenticationRole, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		return apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	_, err := crr.FindChatRoomByID(ctx, chatRoomId)
	if err != nil {
		return apperror.ErrChatRoomNotFound(nil)
	}

	crReq.Id = chatRoomId
	if authenticationRole == constant.RoleDoctor {
		doctor, err := dr.FindDoctorByAuthId(ctx, authenticationId)
		if err != nil {
			return err
		}

		crReq.DoctorId = doctor.Id

		err = crr.UpdateDoctorIsTypingByDoctorId(ctx, crReq)
		if err != nil {
			return err
		}
	}

	if authenticationRole == constant.RoleUser {
		user, err := ur.FindUserByAuthId(ctx, authenticationId)
		if err != nil {
			return err
		}

		crReq.UserId = *user.Id
		err = crr.UpdateUserIsTypingByUserId(ctx, crReq)
		if err != nil {
			return err
		}
	}

	return nil
}

func (u *chatRoomUsecaseImpl) GetAllMessage(ctx context.Context) ([]entity.ChatRoom, error) {
	crr := u.repoStore.ChatRoomRepository()
	dr := u.repoStore.DoctorRepository()
	ur := u.repoStore.UserRepository()
	authenticationRole, ok := ctx.Value(constant.AuthenticationRole).(string)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	authenticationId, ok := ctx.Value(constant.AuthenticationIdKey).(int64)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrInterfaceCasting)
	}

	err := crr.DeleteChatRoomAfterExpired(ctx)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	if authenticationRole == constant.RoleDoctor {
		doctor, err := dr.FindDoctorByAuthId(ctx, authenticationId)
		if err != nil {
			return nil, err
		}
		allMessage, err := crr.GetAllMessageForDoctor(ctx, doctor.Id)
		if err != nil {
			return nil, err
		}
		return allMessage, nil
	}

	if authenticationRole == constant.RoleUser {
		user, err := ur.FindUserByAuthId(ctx, authenticationId)
		if err != nil {
			return nil, err
		}
		allMessage, err := crr.GetAllMessageForUser(ctx, *user.Id)
		if err != nil {
			return nil, err
		}
		return allMessage, nil
	}

	return nil, nil
}

func (u *chatRoomUsecaseImpl) GetChatRoomById(ctx context.Context, chatRoomId int64) (*entity.ChatRoom, error) {
	crr := u.repoStore.ChatRoomRepository()

	chatRoom, err := crr.FindChatRoomByID(ctx, chatRoomId)
	if err != nil {
		return nil, err
	}

	return chatRoom, nil

}

func (u *chatRoomUsecaseImpl) DeleteChatRoom(ctx context.Context, chatRoomId int64) error {
	crr := u.repoStore.ChatRoomRepository()

	err := crr.DeleteChatRoomById(ctx, chatRoomId)
	if err != nil {
		return apperror.ErrChatRoomNotFound(nil)
	}

	return nil
}
