package models

import "time"

type Student struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;uniqueIndex"`
	User      User      `gorm:"foreignKey:UserID"` // Relasi ke tabel users
	NIS       string    `gorm:"size:30;uniqueIndex;not null"`
	ClassID   uint      `gorm:"not null"`
	Class     Class     `gorm:"foreignKey:ClassID"` // Relasi ke tabel classes
	Phone     string    `gorm:"size:20"`
	Address   string    `gorm:"size:255"`
	CreatedAt time.Time
	UpdatedAt time.Time
}