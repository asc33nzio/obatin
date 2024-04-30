package repository

import (
	"context"
	"database/sql"
	"obatin/apperror"
	"obatin/entity"
)

type ChatRoomRepository interface {
	CreateOne(ctx context.Context, u entity.ChatRoom) error
	FindChatRoomByID(ctx context.Context, chatRoomId int64) (*entity.ChatRoom, error)
	UpdateDoctorIsTypingByDoctorId(ctx context.Context, u entity.ChatRoom) error
	UpdateUserIsTypingByUserId(ctx context.Context, u entity.ChatRoom) error
	GetAllMessageForDoctor(ctx context.Context, doctorId int64) ([]entity.ChatRoom, error)
	GetAllMessageForUser(ctx context.Context, userId int64) ([]entity.ChatRoom, error)
	IsChatRoomExist(ctx context.Context, userId int64, doctorId int64) (bool, error)
	DeleteChatRoomById(ctx context.Context, chatRoomId int64) error
	DeleteChatRoomAfterExpired(ctx context.Context) error
}

type chatRoomRepositoryPostgres struct {
	db Querier
}

func NewChatRoomRepositoryPostgres(db *sql.DB) *chatRoomRepositoryPostgres {
	return &chatRoomRepositoryPostgres{
		db: db,
	}
}

func (r *chatRoomRepositoryPostgres) FindChatRoomByID(ctx context.Context, chatRoomId int64) (*entity.ChatRoom, error) {
	res := entity.ChatRoom{}

	q := `
		SELECT 
			id,     
			user_id,
			doctor_id,
			is_active
		FROM 
			chat_rooms
		WHERE
			id = $1
		AND
		    deleted_at IS NULL

	`
	err := r.db.QueryRowContext(ctx, q, chatRoomId).Scan(
		&res.Id,
		&res.UserId,
		&res.DoctorId,
		&res.IsActive,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrChatRoomNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &res, nil
}

func (r *chatRoomRepositoryPostgres) CreateOne(ctx context.Context, u entity.ChatRoom) error {

	queryCreateChatRoom := `
		INSERT INTO
			chat_rooms(
				user_id,
				doctor_id,
				is_active
			)
			VALUES( 
				$1, 
				$2,
				true
			)
	`

	res, err := r.db.ExecContext(ctx, queryCreateChatRoom, u.UserId, u.DoctorId)
	if err != nil {
		return apperror.NewInternal(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *chatRoomRepositoryPostgres) UpdateUserIsTypingByUserId(ctx context.Context, crReq entity.ChatRoom) error {

	queryCreateChatRoom := `
		UPDATE
			chat_rooms
		SET
			is_user_typing = $3
		WHERE
			user_id = $1
		AND
			id = $2
		AND 
			deleted_at IS NULL
	`

	res, err := r.db.ExecContext(ctx, queryCreateChatRoom, crReq.UserId, crReq.Id, crReq.IsTyping)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *chatRoomRepositoryPostgres) UpdateDoctorIsTypingByDoctorId(ctx context.Context, crReq entity.ChatRoom) error {

	queryCreateChatRoom := `
		UPDATE
			chat_rooms
		SET
			is_doctor_typing = $3
		WHERE
			doctor_id = $1
		AND
			id = $2
		AND 
			deleted_at IS NULL
	`

	res, err := r.db.ExecContext(ctx, queryCreateChatRoom, crReq.DoctorId, crReq.Id, crReq.IsTyping)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *chatRoomRepositoryPostgres) GetAllMessageForDoctor(ctx context.Context, doctorId int64) ([]entity.ChatRoom, error) {
	chatRooms := []entity.ChatRoom{}

	q := `
	SELECT 
    	cr.id,     
    	cr.user_id,
    	cr.doctor_id,
    	m.message,
		u.name,
		u.avatar_url,
		cr.is_active
	FROM 
    	chat_rooms cr
	JOIN (
    	SELECT
        	chat_room_id,
        	MAX(created_at) as last_message_created_at
    	FROM
        	messages m
    	GROUP BY
        	chat_room_id
		) last_msg ON cr.id = last_msg.chat_room_id
	JOIN
    	messages m
	ON
    	cr.id = m.chat_room_id AND m.created_at = last_msg.last_message_created_at
	JOIN
		users u
	ON
		u.id = cr.user_id
	WHERE
    	cr.doctor_id = $1
	AND
    	cr.deleted_at IS null
	`
	rows, err := r.db.QueryContext(ctx, q, doctorId)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		chatRoom := entity.ChatRoom{}
		err = rows.Scan(
			&chatRoom.Id,
			&chatRoom.UserId,
			&chatRoom.DoctorId,
			&chatRoom.LastMessage,
			&chatRoom.UserName,
			&chatRoom.AvatarUser,
			&chatRoom.IsActive,
		)
		if err != nil {
			return nil, err
		}
		chatRooms = append(chatRooms, chatRoom)
	}

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return chatRooms, nil
}

func (r *chatRoomRepositoryPostgres) GetAllMessageForUser(ctx context.Context, userId int64) ([]entity.ChatRoom, error) {
	chatRooms := []entity.ChatRoom{}

	q := `
	SELECT 
    	cr.id,     
    	cr.user_id,
    	cr.doctor_id,
    	m.message,
		d.name,
		d.avatar_url,
		ds.name,
		cr.is_active
	FROM 
    	chat_rooms cr
	LEFT JOIN (
    	SELECT
        	chat_room_id,
        	MAX(created_at) as last_message_created_at
    	FROM
        	messages m
    	GROUP BY
        	chat_room_id
		) last_msg ON cr.id = last_msg.chat_room_id
	LEFT JOIN
    	messages m
	ON
    	cr.id = m.chat_room_id AND m.created_at = last_msg.last_message_created_at
	JOIN
		doctors d
	ON
		d.id = cr.doctor_id
	JOIN
		doctor_specializations ds
	ON
		d.doctor_specialization_id = ds.id
	WHERE
    	cr.user_id = $1
	AND
    	cr.deleted_at IS null
	`
	rows, err := r.db.QueryContext(ctx, q, userId)

	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	defer rows.Close()

	for rows.Next() {
		chatRoom := entity.ChatRoom{}
		err = rows.Scan(
			&chatRoom.Id,
			&chatRoom.UserId,
			&chatRoom.DoctorId,
			&chatRoom.LastMessage,
			&chatRoom.DoctorName,
			&chatRoom.AvatarDoctor,
			&chatRoom.DoctorSpecialization,
			&chatRoom.IsActive,
		)
		if err != nil {
			return nil, err
		}
		chatRooms = append(chatRooms, chatRoom)
	}

	if err != nil {
		return nil, apperror.NewInternal(err)
	}

	return chatRooms, nil
}

func (r *chatRoomRepositoryPostgres) IsChatRoomExist(ctx context.Context, userId int64, doctorId int64) (bool, error) {
	var isChatRoomExist bool
	queryIsEmailExist := `
		SELECT EXISTS (
			SELECT 
				1 	
			FROM 
				chat_rooms 
			WHERE 
				user_id = $1
			AND
				doctor_id = $2
			AND 
				is_active = true
			AND
				deleted_at IS NULL
		)
	`

	err := r.db.QueryRowContext(
		ctx,
		queryIsEmailExist,
		userId,
		doctorId,
	).Scan(
		&isChatRoomExist,
	)
	if err != nil {
		return false, apperror.NewInternal(err)
	}

	return isChatRoomExist, nil
}

func (r *chatRoomRepositoryPostgres) DeleteChatRoomById(ctx context.Context, chatRoomId int64) error {

	queryCreateChatRoom := `
		UPDATE
			chat_rooms
		SET
			deleted_at = now()
		WHERE
			id = $1
	`

	res, err := r.db.ExecContext(ctx, queryCreateChatRoom, chatRoomId)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(err)
	}

	return nil
}

func (r *chatRoomRepositoryPostgres) DeleteChatRoomAfterExpired(ctx context.Context) error {
	query := `
		UPDATE 
			chat_rooms
		SET 
			is_active = false
		WHERE 
			NOW() > expired_at
	`

	res, err := r.db.ExecContext(
		ctx,
		query,
	)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return nil
	}

	return nil
}
