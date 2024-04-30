package dto

type ChatRoomResponse struct {
	Data []MessageListResponse `json:"data,omitempty"`
}

type MessageListResponse struct {
	Id             int64  `json:"id"`
	AvatarUrl      string `json:"avatar_url"`
	Name           string `json:"name"`
	Message        string `json:"message"`
	CreatedMessage string `json:"created_at"`
}

type ChatRoomIdParam struct {
	Id int64 `uri:"id" binding:"required"`
}
