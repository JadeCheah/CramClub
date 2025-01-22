package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string `gorm:"type:varchar(100);unique;not null" json:"username"` // username is unique identifier
	PasswordHash string `gorm:"type:varchar(255);not null" json:"-"`
	ProfilePic   string `gorm:"type:varchar(255)" json:"profilePic"`

	//back-reference to threads
	Thread []Thread `gorm:"foreignKey:UserID" json:"-"`
}
