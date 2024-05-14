package repository

import (
	"context"
	"database/sql"
	"fmt"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/entity"
	"strings"
)

type ChatRoomRepository interface {
	CreateOne(ctx context.Context, u entity.ChatRoom) error
	FindChatRoomByID(ctx context.Context, chatRoomId int64) (*entity.ChatRoom, error)
	UpdateDoctorIsTypingByDoctorId(ctx context.Context, u entity.ChatRoom) error
	UpdateUserIsTypingByUserId(ctx context.Context, u entity.ChatRoom) error
	GetAllMessageForDoctor(ctx context.Context, doctorId int64, params entity.Pagination) (*entity.ChatRoomListPage, error)
	GetAllMessageForUser(ctx context.Context, userId int64, params entity.Pagination) (*entity.ChatRoomListPage, error)
	IsChatRoomExist(ctx context.Context, userId int64, doctorId int64) (bool, error)
	DeleteChatRoomById(ctx context.Context, chatRoomId int64) error
	UpdateChatRoomValidByUserId(ctx context.Context, userId int64, isUser bool) error
	DeleteChatRoomAfterExpiredById(ctx context.Context, chatRoomId int64) error
	UpdateChatRoomUpdatedAtByID(ctx context.Context, chatRoomId int64) error
	UpdateChatRoomInactiveByChatId(ctx context.Context, chatRoomId int64) error
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
			is_active,
			is_doctor_typing,
			is_user_typing
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
		&res.IsDoctorTyping,
		&res.IsUserTyping,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperror.ErrChatRoomNotFound(err)
		}

		return nil, apperror.NewInternal(err)
	}

	return &res, nil
}

func (r *chatRoomRepositoryPostgres) UpdateChatRoomInactiveByChatId(ctx context.Context, chatRoomId int64) error {
	queryEndChat := `
		UPDATE
			chat_rooms
		SET
			is_active = FALSE
		WHERE
			id = $1
	`
	res, err := r.db.ExecContext(ctx, queryEndChat, chatRoomId)
	if err != nil {
		return apperror.NewInternal(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
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
		return apperror.NewInternal(apperror.ErrStlNotFound)
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

	res, err := r.db.ExecContext(ctx, queryCreateChatRoom, crReq.UserId, crReq.Id, crReq.IsUserTyping)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
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

	res, err := r.db.ExecContext(ctx, queryCreateChatRoom, crReq.DoctorId, crReq.Id, crReq.IsDoctorTyping)
	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}
	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *chatRoomRepositoryPostgres) GetAllMessageForDoctor(ctx context.Context, doctorId int64, params entity.Pagination) (*entity.ChatRoomListPage, error) {
	chatRooms := []entity.ChatRoom{}
	rowsCount := 0
	paramsCount := appconstant.StartingParamsCount
	var queryDataCount strings.Builder
	var queryPage strings.Builder
	var data []interface{}

	queryGetAllMessage := `
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
	ORDER BY
		cr.is_active DESC,
		cr.updated_at DESC
	`
	data = append(data, doctorId)
	queryDataCount.WriteString(fmt.Sprintf(` SELECT COUNT (*) FROM ( %v )`, queryGetAllMessage))
	err := r.db.QueryRowContext(ctx, queryDataCount.String(), data...).Scan(&rowsCount)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	queryPage.WriteString(queryGetAllMessage)
	paginationParams, paginationData := convertPaginationParamsToSql(params.Limit, params.Page, paramsCount+1)
	queryPage.WriteString(paginationParams)
	data = append(data, paginationData...)
	rows, err := r.db.QueryContext(
		ctx,
		queryPage.String(),
		data...,
	)

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

	return &entity.ChatRoomListPage{
		ChatRooms: chatRooms,
		TotalRows: rowsCount,
	}, nil
}

func (r *chatRoomRepositoryPostgres) GetAllMessageForUser(ctx context.Context, userId int64, params entity.Pagination) (*entity.ChatRoomListPage, error) {
	chatRooms := []entity.ChatRoom{}
	rowsCount := 0
	paramsCount := appconstant.StartingParamsCount
	var queryDataCount strings.Builder
	var queryPage strings.Builder
	var data []interface{}

	queryGetAllMessage := `
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
	ORDER BY
		cr.is_active DESC,
		cr.updated_at DESC
	`
	data = append(data, userId)
	queryDataCount.WriteString(fmt.Sprintf(` SELECT COUNT (*) FROM ( %v )`, queryGetAllMessage))
	err := r.db.QueryRowContext(ctx, queryDataCount.String(), data...).Scan(&rowsCount)
	if err != nil {
		return nil, apperror.NewInternal(err)
	}
	queryPage.WriteString(queryGetAllMessage)

	paginationParams, paginationData := convertPaginationParamsToSql(params.Limit, params.Page, paramsCount+1)
	queryPage.WriteString(paginationParams)
	data = append(data, paginationData...)
	rows, err := r.db.QueryContext(
		ctx,
		queryPage.String(),
		data...,
	)

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

	return &entity.ChatRoomListPage{
		ChatRooms: chatRooms,
		TotalRows: rowsCount,
	}, nil
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
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}

func (r *chatRoomRepositoryPostgres) DeleteChatRoomAfterExpiredById(ctx context.Context, chatRoomId int64) error {
	query := `
		UPDATE 
			chat_rooms
		SET 
			is_active = false
		WHERE 
			NOW() > expired_at
		AND
			id = $1
	`

	res, err := r.db.ExecContext(
		ctx,
		query,
		chatRoomId,
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

func (r *chatRoomRepositoryPostgres) UpdateChatRoomValidByUserId(ctx context.Context, userId int64, isUser bool) error {
	var query strings.Builder

	query.WriteString(`
	UPDATE 
		chat_rooms
	SET 
		is_active = false, updated_at = NOW()
	WHERE 
	`)
	if !isUser {
		query.WriteString(" user_id = $1 ")
	} else {
		query.WriteString(" doctor_id = $1 ")
	}

	query.WriteString("AND NOW() > expired_at AND is_active = true")
	res, err := r.db.ExecContext(
		ctx,
		query.String(),
		userId)

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

func (r *chatRoomRepositoryPostgres) UpdateChatRoomUpdatedAtByID(ctx context.Context, chatRoomId int64) error {
	query := `
	UPDATE 
		chat_rooms
	SET 
		updated_at = NOW()
	WHERE 
		id = $1
`

	res, err := r.db.ExecContext(
		ctx,
		query,
		chatRoomId)

	if err != nil {
		return apperror.NewInternal(err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return apperror.NewInternal(err)
	}

	if rowsAffected == 0 {
		return apperror.NewInternal(apperror.ErrStlNotFound)
	}

	return nil
}
