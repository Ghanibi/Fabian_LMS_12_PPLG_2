package models

import "time"

type Exam struct {
	ID             uint      `gorm:"primaryKey"`
	ClassSubjectID uint      `gorm:"not null"`
	TeacherID      uint      `gorm:"not null"`
	Title          string    `gorm:"size:150;not null"`
	Description    string    `gorm:"type:text"`
	Duration       int       `gorm:"not null"`
	StartTime      time.Time `gorm:"not null"`
	EndTime        time.Time `gorm:"not null"`
	MaxScore       float64   `gorm:"not null;default:100"`
	IsPublished    bool      `gorm:"default:false"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}