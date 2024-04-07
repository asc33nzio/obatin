package dto

type APIResponse struct {
	Message    string              `json:"message"`
	Data       any                 `json:"data,omitempty"`
	Pagination *PaginationResponse `json:"pagination,omitempty"`
}

type PaginationResponse struct {
	Page         int   `json:"page"`
	PageCount    int64 `json:"page_count"`
	TotalRecords int64 `json:"total_records"`
	Limit        int   `json:"limit"`
}
