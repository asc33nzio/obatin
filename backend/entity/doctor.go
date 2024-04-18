package entity

type Doctor struct {
	Id               int64
	Specialization   int64
	Name             string
	Avatar           string
	Experiences      bool
	Certificate      string
	Fee              int64
	Opening          string
	OperationalHours string
	OperationalDays  string
	AuthenticationID int64
}
