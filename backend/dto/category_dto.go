package dto

import (
	"mime/multipart"
	"obatin/entity"
)

type CategoryResponse struct {
	Id       int64   `json:"id"`
	Name     string  `json:"name"`
	Slug     string  `json:"category_slug"`
	ImageUrl *string `json:"image_url"`
	ParentId *int64  `json:"parent_id"`
	HasChild bool    `json:"has_child"`
	Level    int     `json:"level"`
}

type CategoryRequest struct {
	Name     string `form:"name" binding:"required"`
	Slug     string `form:"category_slug" binding:"required"`
	ParentId *int64 `form:"parent_id"`
	HasChild bool   `form:"has_child"`
	Level    int    `form:"level" binding:"required,min=1,max=3"`
}

type CategorySlugParam struct {
	Slug string `uri:"category_slug" binding:"required"`
}

type CategoryUpdateRequest struct {
	Name     *string `form:"name" binding:"omitempty"`
	Slug     *string `form:"category_slug" binding:"omitempty"`
	ParentId *int64  `form:"parent_id" binding:"omitempty"`
	HasChild *bool   `form:"has_child" binding:"omitempty"`
	Level    *int    `form:"level" binding:"omitempty,min=1,max=3"`
}

func ToCategoryResponse(c *entity.Category) CategoryResponse {
	return CategoryResponse{
		Id:       c.Id,
		Name:     c.Name,
		Slug:     c.Slug,
		ImageUrl: c.ImageUrl,
		ParentId: c.ParentId,
		HasChild: c.HasChild,
		Level:    c.Level,
	}
}

func (c CategoryRequest) ToCategoryRequestBodyEntity(image multipart.File) entity.CategoryRequest {
	return entity.CategoryRequest{
		Name:     c.Name,
		Slug:     c.Slug,
		ImageUrl: image,
		ParentId: c.ParentId,
		HasChild: c.HasChild,
		Level:    c.Level,
	}
}

func (c CategoryUpdateRequest) ToCategoryUpdateBodyEntity(image multipart.File) entity.CategoryUpdateRequest {
	res := entity.CategoryUpdateRequest{
		Name:     c.Name,
		Slug:     c.Slug,
		ParentId: c.ParentId,
		HasChild: c.HasChild,
		Level:    c.Level,
	}
	if image != nil {
		res.ImageUrl = &image
	}
	return res
}
