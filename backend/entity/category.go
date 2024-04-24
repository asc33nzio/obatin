package entity

import "mime/multipart"

type Category struct {
	Id       int64
	Name     string
	Slug     string
	ImageUrl *string
	ParentId *int64
	HasChild bool
	Level    int
}

type CategoryRequest struct{
	Name     string
	Slug     string
	ImageUrl multipart.File
	ParentId *int64
	HasChild bool
	Level    int
}

type CategoryUpdateRequest struct{
	Name     *string
	Slug     *string
	ImageUrl *multipart.File
	ParentId *int64
	HasChild *bool
	Level    *int
}

type CategoryBody struct {
	Name     string
	Slug     string
	ImageUrl string
	ParentId *int64
	HasChild bool
	Level    int
}

type CategoryUpdateBody struct {
	Name     *string
	Slug     *string
	ImageUrl *string
	ParentId *int64
	HasChild *bool
	Level    *int
}

type CategoryNested struct {
	Id       int64            `json:"id"`
	Name     string           `json:"name"`
	Slug     string           `json:"category_slug"`
	ImageUrl *string          `json:"image_url,omitempty"`
	ParentId *int64           `json:"parent_id,omitempty"`
	HasChild bool             `json:"has_child"`
	Level    int              `json:"category_level"`
	Children []CategoryNested `json:"children,omitempty"`
}
