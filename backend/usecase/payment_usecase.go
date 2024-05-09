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

type PaymentUsecase interface {
	UploadPaymentProof(ctx context.Context, p *entity.Payment) error
	UpdatePaymentStatus(ctx context.Context, p *entity.Payment) error
	GetAllPendingPayments(ctx context.Context) ([]*entity.Payment, error)
	CancelPayment(ctx context.Context, p *entity.Payment) error
}

type paymentUsecaseImpl struct {
	repoStore        repository.RepoStore
	config           *config.Config
	cloudinaryUpload util.CloudinaryItf
}

func NewPaymentUsecaseImpl(
	repoStore repository.RepoStore,
	config *config.Config,
	cloudinaryUpload util.CloudinaryItf,
) *paymentUsecaseImpl {
	return &paymentUsecaseImpl{
		repoStore:        repoStore,
		config:           config,
		cloudinaryUpload: cloudinaryUpload,
	}
}

func (u *paymentUsecaseImpl) UploadPaymentProof(ctx context.Context, p *entity.Payment) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		ur := rs.UserRepository()
		pr := rs.PaymentRepository()
		or := rs.OrderRepository()

		userId, err := ur.FindUserIdByAuthId(ctx, p.User.Authentication.Id)
		if err != nil {
			return nil, err
		}

		p.User.Id = userId

		if p.PaymentProofFile != nil {
			uploadUrl, err := u.cloudinaryUpload.ImageUploadHelper(ctx, p.PaymentProofFile)
			if err != nil {
				return nil, apperror.NewInternal(err)
			}

			p.PaymentProofUrl = &uploadUrl
		}

		err = pr.UpdateOnePayment(ctx, p)
		if err != nil {
			return nil, err
		}

		orders, err := or.FindOrdersByPaymentId(ctx, p.Id)
		if err != nil {
			return nil, err
		}

		for _, o := range orders {
			o.Status = appconstant.OrderWaitingConfirmation
			err := or.UpdateOrderById(ctx, o)
			if err != nil {
				return nil, err
			}
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}

func (u *paymentUsecaseImpl) UpdatePaymentStatus(ctx context.Context, p *entity.Payment) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		pr := rs.PaymentRepository()
		or := rs.OrderRepository()

		err := pr.UpdateOnePayment(ctx, p)
		if err != nil {
			return nil, err
		}

		orders, err := or.FindOrdersByPaymentId(ctx, p.Id)
		if err != nil {
			return nil, err
		}

		for _, o := range orders {
			if *p.IsConfirmed {
				o.Status = appconstant.OrderProcessed
			} else {
				o.Status = appconstant.OrderWaitingPayment
			}
			err := or.UpdateOrderById(ctx, o)
			if err != nil {
				return nil, err
			}
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}

func (u *paymentUsecaseImpl) GetAllPendingPayments(ctx context.Context) ([]*entity.Payment, error) {
	pr := u.repoStore.PaymentRepository()

	payments, err := pr.FindAllPendingPayments(ctx)
	if err != nil {
		return nil, err
	}

	return payments, nil
}

func (u *paymentUsecaseImpl) CancelPayment(ctx context.Context, p *entity.Payment) error {
	_, err := u.repoStore.Atomic(ctx, func(rs repository.RepoStore) (any, error) {
		pr := rs.PaymentRepository()
		or := rs.OrderRepository()
		ur := rs.UserRepository()

		userId, err := ur.FindUserIdByAuthId(ctx, p.User.Authentication.Id)
		if err != nil {
			return nil, err
		}

		p.User.Id = userId

		err = pr.UpdateOnePayment(ctx, p)
		if err != nil {
			return nil, err
		}

		orders, err := or.FindOrdersByPaymentId(ctx, p.Id)
		if err != nil {
			return nil, err
		}

		for _, o := range orders {
			if o.Status != appconstant.OrderWaitingPayment {
				return nil, apperror.ErrForbiddenAccess(apperror.ErrStlForbiddenAccess)
			}
			o.Status = appconstant.OrderCancel
			err := or.UpdateOrderById(ctx, o)
			if err != nil {
				return nil, err
			}
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}
