package models

import "time"

type Student struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;uniqueIndex"`
	NIS       string    `gorm:"size:30;uniqueIndex;not null"`
	ClassID   uint      `gorm:"not null"`
	Phone     string    `gorm:"size:20"`
	Address   string    `gorm:"size:255"`
	CreatedAt time.Time
	UpdatedAt time.Time
}