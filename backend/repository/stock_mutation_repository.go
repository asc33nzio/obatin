package repository

import "database/sql"

type StockMutationRepository interface {
}

type stockMutationRepositoryPostgres struct {
	db Querier
}

func NewStockMutationRepositoryPostgres(db *sql.DB) *stockMutationRepositoryPostgres {
	return &stockMutationRepositoryPostgres{
		db: db,
	}
}
