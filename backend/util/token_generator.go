package util

import (
	"crypto/rand"
	"encoding/base64"
)

type TokenGeneratorItf interface {
	GetRandomToken(length int) (string, error)
}

type TokenGenerator struct{}

func NewTokenGenerator() *TokenGenerator {
	return &TokenGenerator{}
}

func (g *TokenGenerator) GetRandomToken(length int) (string, error) {
	randomBytes := make([]byte, length)

	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(randomBytes)[:length], nil
}
