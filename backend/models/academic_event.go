package models

import "time"

type AcademicEvent struct {
	ID          uint      `gorm:"primaryKey"`
	Title       string    `gorm:"size:150;not null"`
	Description string    `gorm:"type:text"`
	StartDate   time.Time `gorm:"not null"`
	EndDate     time.Time
	Type        string    `gorm:"size:30;not null"`
	CreatedBy   uint      `gorm:"not null"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}