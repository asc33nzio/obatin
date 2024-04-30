package entity

type Message struct {
	Id         int64
	ChatRoomId int64
	Message    string
	Sender     string
	Name       string
	AvatarUrl  string
	CreatedAt  string
	UserId     int64
	DoctorId   int64
}
