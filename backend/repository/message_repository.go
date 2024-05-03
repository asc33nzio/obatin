package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type MessageRepository interface {
	CreateMessage(ctx context.Context, mReq entity.Message) error
	GetAllMessagesByChatRoomId(ctx context.Context, chatRoomId int64) ([]entity.Message, error)
}

type messageRepositoryPostgres struct {
	db Querier
}

func NewMessageRepositoryPostgres(db *sql.DB) *messageRepositoryPostgres {
	return &messageRepositoryPostgres{
		db: db,
	}
}

func (r *messageRepositoryPostgres) CreateMessage(ctx context.Context, mReq entity.Message) error {
	queryCreateMessage := `
		INSERT INTO
			messages(
				message,
				chat_room_id,
				sender
			)
			VALUES( 
				$1,
				$2,
				$3
			)
	`

	res, err := r.db.ExecContext(ctx, queryCreateMessage, mReq.Message, mReq.ChatRoomId, mReq.Sender)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.ErrInvalidReq(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *messageRepositoryPostgres) GetAllMessagesByChatRoomId(ctx context.Context, chatRoomId int64) ([]entity.Message, error) {
	messages := []entity.Message{}

	queryGetMessageByChatRoomId := `
	SELECT 
		m.id,
		m.message,
		m.sender,
		m.created_at
	FROM
		chat_rooms cr
	JOIN 
		messages m
	ON 
		cr.id = m.chat_room_id
	WHERE
		cr.id = $1
	AND
		m.deleted_at IS NULL
	AND
		cr.deleted_at IS NULL
	ORDER BY
		m.created_at ASC
	`

	rows, err := r.db.QueryContext(
		ctx,
		queryGetMessageByChatRoomId,
		chatRoomId,
	)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		message := entity.Message{}
		err = rows.Scan(
			&message.Id,
			&message.Message,
			&message.Sender,
			&message.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return messages, nil
}
