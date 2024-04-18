package entity

type PaginationResponse struct {
	Page         int   
	PageCount    int64 
	TotalRecords int64 
	Limit        int   
}
