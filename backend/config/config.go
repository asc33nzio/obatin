package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	dbUrl      string
	serverPort string
}

func NewConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	dbUrl := os.Getenv("DATABASE_URL")

	serverPort := os.Getenv("SERVER_PORT")

	return &Config{
		dbUrl:      dbUrl,
		serverPort: serverPort,
	}, nil
}

func (c *Config) DBUrl() string {
	return c.dbUrl
}

func (c *Config) ServerPort() string {
	return c.serverPort
}
