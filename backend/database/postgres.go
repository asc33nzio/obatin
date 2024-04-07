package database

import (
	"database/sql"

	"git.garena.com/naufal.yassar/group-project/config"
	_ "github.com/jackc/pgx/v5/stdlib"
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
