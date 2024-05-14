package usecase

import (
	"context"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/appvalidator"
	"obatin/config"
	"obatin/entity"
	"obatin/repository"
	"obatin/util"
)

type PartnerUsecase interface {
	CreateNewPartner(ctx context.Context, uReq entity.Partner) error
	GetAllPartner(ctx context.Context, params entity.PartnerFilter) (*entity.PartnerListPage, error)
	UpdateOnePartner(ctx context.Context, pReq entity.PartnerUpdateRequest, id int64) (*entity.Partner, error)
	GetPartnerById(ctx context.Context, id int64) (*entity.Partner, error)
}

type partnerUsecaseImpl struct {
	repoStore        repository.RepoStore
	cryptoHash       util.CryptoHashItf
	jwtAuth          util.JWTItf
	config           *config.Config
	tokenGenerator   util.TokenGeneratorItf
	cloudinaryUpload util.CloudinaryItf
	sendEmail        util.SendEmailItf
}

func NewPartnerUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
	cryptoHash util.CryptoHashItf,
	jwtAuth util.JWTItf,
	tokenGenerator util.TokenGeneratorItf,
	cloudinaryUpload util.CloudinaryItf,
	sendEmail util.SendEmailItf,
) *partnerUsecaseImpl {
	return &partnerUsecaseImpl{
		repoStore:        repoStore,
		cryptoHash:       cryptoHash,
		jwtAuth:          jwtAuth,
		config:           config,
		tokenGenerator:   tokenGenerator,
		cloudinaryUpload: cloudinaryUpload,
		sendEmail:        sendEmail,
	}
}

func (u *partnerUsecaseImpl) CreateNewPartner(ctx context.Context, uReq entity.Partner) error {
	res, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ar := rs.AuthenticationRepository()
		pr := rs.PartnerRepository()

		authenticationRole, ok := ctx.Value(appconstant.AuthenticationRole).(string)
		if !ok {
			return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
		}

		if authenticationRole != appconstant.RoleAdmin {
			return nil, apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
		}

		isPasswordValid := appvalidator.IsValidPassword(uReq.Password)
		if !isPasswordValid {
			return nil, apperror.ErrInvalidPassword(apperror.ErrStlInvalidPassword)
		}

		isValidEmailFormat := appvalidator.IsValidEmail(uReq.Email)
		if !isValidEmailFormat {
			return nil, apperror.ErrInvalidEmail(apperror.ErrStlInvalidEmail)
		}

		isEmailExist, err := ar.IsEmailExist(ctx, uReq.Email)
		if err != nil {
			return nil, err
		}

		if isEmailExist {
			return nil, apperror.ErrEmailAlreadyRegistered(nil)
		}

		isPartnerExist, err := pr.IsPartnerExist(ctx, uReq.Name)
		if err != nil {
			return nil, err
		}

		if isPartnerExist {
			return nil, apperror.ErrPartnerAlreadyExist(nil)
		}

		defaultPassword, err := u.tokenGenerator.GetRandomToken(u.config.RandomTokenLength())
		if err != nil {
			return nil, err
		}

		hashedPass, err := u.cryptoHash.HashPassword(defaultPassword, u.config.HashCost())
		if err != nil {
			return nil, apperror.NewInternal(err)
		}

		uploadLogoUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, uReq.Logo)
		if err != nil {
			return "", apperror.NewInternal(err)
		}

		uReq.Password = string(hashedPass)
		uReq.Role = appconstant.RoleManager
		uReq.IsApproved = appconstant.HasNotApproved
		uReq.IsVerify = appconstant.HasVerified
		uReq.LogoURL = uploadLogoUrl

		uReqAuth := entity.Authentication{
			Email:      uReq.Email,
			Password:   uReq.Password,
			Role:       uReq.Role,
			IsApproved: true,
			IsVerified: true,
		}

		auth, err := ar.CreateOne(ctx, uReqAuth)
		if err != nil {
			return nil, err
		}

		uReq.AuthenticationId = auth.Id

		partner, err := pr.CreateOne(ctx, uReq)
		if err != nil {
			return nil, err
		}

		return partner, nil
	})
	if err != nil {
		return err
	}

	_, ok := res.(*entity.Partner)
	if !ok {
		return apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	return nil
}

func (u *partnerUsecaseImpl) GetAllPartner(ctx context.Context, params entity.PartnerFilter) (*entity.PartnerListPage, error) {
	pr := u.repoStore.PartnerRepository()

	authenticationRole, ok := ctx.Value(appconstant.AuthenticationRole).(string)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	if authenticationRole != appconstant.RoleAdmin {
		return nil, apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
	}

	if params.Limit < 1 {
		params.Limit = appconstant.DefaultPartnerLimit
	}
	if params.Page < 1 {
		params.Page = 1
	}

	res, err := pr.GetPartnerList(ctx, params)
	if err != nil {
		return nil, err
	}

	res.Pagination = entity.PaginationResponse{
		Page:         params.Page,
		PageCount:    int64(res.TotalRows) / int64(params.Limit),
		Limit:        params.Limit,
		TotalRecords: int64(res.TotalRows),
	}
	if res.Pagination.TotalRecords-(res.Pagination.PageCount*int64(params.Limit)) > 0 {
		res.Pagination.PageCount = int64(res.Pagination.PageCount) + 1
	}

	return res, nil
}

func (u *partnerUsecaseImpl) UpdateOnePartner(ctx context.Context, pReq entity.PartnerUpdateRequest, id int64) (*entity.Partner, error) {
	res, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		pr := u.repoStore.PartnerRepository()
		ar := u.repoStore.AuthenticationRepository()

		authenticationRole, ok := ctx.Value(appconstant.AuthenticationRole).(string)
		if !ok {
			return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
		}

		if authenticationRole != appconstant.RoleAdmin {
			return nil, apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
		}

		if pReq.Email == nil && pReq.Password == nil && pReq.Logo == nil && pReq.Name == nil {
			return nil, apperror.ErrInvalidReq(nil)
		}

		if pReq.Name != nil {
			partnerCount, err := pr.IsPartnerExistUpdate(ctx, *pReq.Name, id)
			if err != nil {
				return nil, err
			}

			if partnerCount > 0 {
				return nil, apperror.ErrPartnerAlreadyExist(nil)
			}
		}

		var logoUploadedUrl *string
		if pReq.Logo != nil {
			logoUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, *pReq.Logo)
			if err != nil {
				return nil, err
			}

			logoUploadedUrl = &logoUrl
		}

		partnerDetail, err := pr.FindPartnerById(ctx, id)
		if err != nil {
			return nil, err
		}

		if pReq.Email != nil || pReq.Password != nil {
			var passwordHashed string
			if pReq.Email != nil {
				authCount, err := ar.IsEmailExistUpdatePartner(ctx, *pReq.Email, partnerDetail.AuthenticationId)
				if err != nil {
					return nil, err
				}

				if authCount > 0 {
					return nil, apperror.ErrPartnerAlreadyExist(nil)
				}

				isValidEmailFormat := appvalidator.IsValidEmail(*pReq.Email)
				if !isValidEmailFormat {
					return nil, apperror.ErrInvalidEmail(apperror.ErrStlInvalidEmail)
				}

			}

			if pReq.Password != nil {

				isPasswordValid := appvalidator.IsValidPassword(*pReq.Password)
				if !isPasswordValid {
					return nil, apperror.ErrInvalidPassword(apperror.ErrStlInvalidPassword)
				}

				hashedPass, err := u.cryptoHash.HashPassword(*pReq.Password, u.config.HashCost())
				if err != nil {
					return nil, apperror.NewInternal(err)
				}

				passwordHashed = string(hashedPass)
			}

			_, err = ar.UpdateAuthenticationPartner(ctx, entity.PartnerUpdateRequest{
				Email:    pReq.Email,
				Password: &passwordHashed,
			}, partnerDetail.AuthenticationId)
			if err != nil {
				return nil, err
			}

		}

		var partnerRes entity.Partner

		if pReq.Name != nil || pReq.Logo != nil {
			partner, err := pr.UpdateOnePartner(ctx, entity.PartnerUpdateRequest{
				Name:    pReq.Name,
				LogoURL: logoUploadedUrl,
			}, id)
			if err != nil {
				return nil, err
			}

			partnerRes = *partner
		}

		return &partnerRes, nil

	})
	if err != nil {
		return nil, err
	}

	partner, ok := res.(*entity.Partner)
	if !ok {
		return nil, apperror.NewInternal(apperror.ErrStlInterfaceCasting)
	}

	return partner, nil
}

func (u *partnerUsecaseImpl) GetPartnerById(ctx context.Context, id int64) (*entity.Partner, error) {
	repo := u.repoStore.PartnerRepository()

	partner, err := repo.FindPartnerById(ctx, id)

	if err != nil {
		return nil, err
	}

	return partner, nil
}
