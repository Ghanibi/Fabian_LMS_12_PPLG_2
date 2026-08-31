package models

import "time"

type Teacher struct {
	ID         uint      `gorm:"primaryKey"`
	UserID     uint      `gorm:"not null;uniqueIndex"`
	NIP        string    `gorm:"size:30;uniqueIndex;not null"`
	Phone      string    `gorm:"size:20"`
	Address    string    `gorm:"size:255"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}