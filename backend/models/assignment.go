package models

import "time"

type Assignment struct {
	ID              uint      `gorm:"primaryKey"`
	ClassSubjectID  uint      `gorm:"not null"`
	TeacherID       uint      `gorm:"not null"`
	Title           string    `gorm:"size:150;not null"`
	Description     string    `gorm:"type:text"`
	DueDate         time.Time `gorm:"not null"`
	MaxScore        float64   `gorm:"not null;default:100"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}