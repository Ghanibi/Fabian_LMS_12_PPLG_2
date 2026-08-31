package models

import "time"

type Notification struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	Title     string    `gorm:"size:150;not null"`
	Message   string    `gorm:"type:text;not null"`
	Type      string    `gorm:"size:30;not null"`
	IsRead    bool      `gorm:"default:false"`
	CreatedAt time.Time
	UpdatedAt time.Time
}