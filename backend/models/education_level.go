package models

import "time"

type EducationLevel struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `gorm:"size:20;uniqueIndex;not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}