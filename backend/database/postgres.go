package database

import (
	"database/sql"

	_ "github.com/jackc/pgx/v5/stdlib"
	"obatin/config"
)

func ConnectDB(config *config.Config) (*sql.DB, error) {
	db, err := sql.Open("pgx", config.DBUrl())
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}
