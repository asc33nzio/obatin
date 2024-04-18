package util

import "golang.org/x/crypto/bcrypt"

type CryptoHashItf interface {
	HashPassword(pwd string, cost int) ([]byte, error)
	CheckPassword(pwd string, hash []byte) error
}

type CryptoBcrypt struct{}

func NewCryptoBcrypt() *CryptoBcrypt {
	return &CryptoBcrypt{}
}

func (b *CryptoBcrypt) HashPassword(pwd string, cost int) ([]byte, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), cost)
	if err != nil {
		return nil, err
	}

	return hash, nil
}

func (b *CryptoBcrypt) CheckPassword(pwd string, hash []byte) error {
	err := bcrypt.CompareHashAndPassword(hash, []byte(pwd))
	if err != nil {
		return err
	}

	return nil
}
