package models

import "time"

type Material struct {
	ID              uint      `gorm:"primaryKey"`
	ClassSubjectID  uint      `gorm:"not null"`
	TeacherID       uint      `gorm:"not null"`
	Title           string    `gorm:"size:150;not null"`
	Description     string    `gorm:"type:text"`
	FileURL         string    `gorm:"size:255"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}