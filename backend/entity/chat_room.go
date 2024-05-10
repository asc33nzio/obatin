package entity

type ChatRoom struct {
	Id                   int64
	UserId               int64
	DoctorId             int64
	IsActive             bool
	IsDoctorTyping       bool
	IsUserTyping         bool
	MessageId            *int64
	Message              *string
	LastMessage          *string
	DoctorName           string
	UserName             string
	AvatarDoctor         string
	AvatarUser           string
	DoctorSpecialization string
}

type ChatRoomListPage struct {
	ChatRooms  []ChatRoom
	TotalRows  int
	Pagination PaginationResponse
}
