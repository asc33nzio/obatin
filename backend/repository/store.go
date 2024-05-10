package repository

import (
	"context"
	"database/sql"

	"obatin/apperror"
)

type RepoStore interface {
	Atomic(ctx context.Context, fn func(RepoStore) (any, error)) (any, error)
	AuthenticationRepository() AuthenticationRepository
	DoctorRepository() DoctorRepository
	ProductRepository() ProductRepository
	UserRepository() UserRepository
	ResetPasswordRepository() ResetPasswordRepository
	DoctorSpecializationRepository() DoctorSpecializationRepository
	CategoryRepository() CategoryRepository
	RefreshTokenRepository() RefreshTokenRepository
	PartnerRepository() PartnerRepository
	AddressRepository() AddressRepository
	ChatRoomRepository() ChatRoomRepository
	MessageRepository() MessageRepository
	CartRepository() CartRepository
	PrescriptionRepository() PrescriptionRepository
	PrescriptionItemRepository() PrescriptionItemRepository
	PharmacyProductRepository() PharmacyProductRepository
	ProductCategoriesRepository() ProductCategoriesRepository
	ShippingRepository() ShippingRepository
	StockMovementRepository() StockMovementRepository
	PaymentRepository() PaymentRepository
	OrderRepository() OrderRepository
	ManufacturerRepository() ManufacturerRepository
	PharmacyRepository() PharmacyRepository
}

type dbStore struct {
	conn    *sql.DB
	querier Querier
}

func NewDBStore(db *sql.DB) *dbStore {
	return &dbStore{
		conn:    db,
		querier: db,
	}
}

func (s *dbStore) Atomic(ctx context.Context, fn func(RepoStore) (any, error)) (any, error) {
	tx, err := s.conn.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer tx.Rollback()

	txRepo := &dbStore{
		conn:    s.conn,
		querier: tx,
	}

	res, err := fn(txRepo)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return res, nil
}

func (s *dbStore) AuthenticationRepository() AuthenticationRepository {
	return &authenticationRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) DoctorRepository() DoctorRepository {
	return &doctorRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) UserRepository() UserRepository {
	return &userRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) ProductRepository() ProductRepository {
	return &productRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) ResetPasswordRepository() ResetPasswordRepository {
	return &resetPasswordRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) DoctorSpecializationRepository() DoctorSpecializationRepository {
	return &doctorSpecializationRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) RefreshTokenRepository() RefreshTokenRepository {
	return &refreshTokenRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) CategoryRepository() CategoryRepository {
	return &categoryRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) PartnerRepository() PartnerRepository {
	return &partnerRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) AddressRepository() AddressRepository {
	return &addressRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) ChatRoomRepository() ChatRoomRepository {
	return &chatRoomRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) MessageRepository() MessageRepository {
	return &messageRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) CartRepository() CartRepository {
	return &cartRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) PrescriptionRepository() PrescriptionRepository {
	return &prescriptionRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) PrescriptionItemRepository() PrescriptionItemRepository {
	return &prescriptionItemRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) PharmacyProductRepository() PharmacyProductRepository {
	return &pharmacyProductRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) ShippingRepository() ShippingRepository {
	return &shippingRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) StockMovementRepository() StockMovementRepository {
	return &stockMovementRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) PaymentRepository() PaymentRepository {
	return &paymentRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) OrderRepository() OrderRepository {
	return &orderRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) ProductCategoriesRepository() ProductCategoriesRepository {
	return &productCategoriesRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) ManufacturerRepository() ManufacturerRepository {
	return &manufacturerRepositoryPostgres{
		db: s.querier,
	}
}

func (s *dbStore) PharmacyRepository() PharmacyRepository {
	return &pharmacyRepositoryPostgres{
		db: s.querier,
	}
}
