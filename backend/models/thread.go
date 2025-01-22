package models

import (
	"gorm.io/gorm"
)

type Thread struct {
	gorm.Model        //embed fields ID, CreatedAt, UpdatedAt, and DeletedAt
	Title      string `json:"title" gorm:"type:varchar(255)"`
	Content    string `json:"content" gorm:"type:text"`
	Ratings    int    `json:"ratings" gorm:"default:0"`
	UserID     uint   `json:"userId"` //foreign key for author, non-nullable
	Author     User   `json:"author" gorm:"foreignKey:UserID;references:ID"`
	Tags       []Tag  `json:"tags" gorm:"many2many:thread_tags"`
}

type Tag struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"type:varchar(255);unique;not null"`
}
