package models

import "time"

type Grade struct {
	ID         uint      `gorm:"primaryKey"`
	StudentID  uint      `gorm:"not null"`
	SubjectID  uint      `gorm:"not null"`
	TeacherID  uint      `gorm:"not null"`
	AssignmentID *uint
	ExamID      *uint
	Score      float64   `gorm:"not null"`
	Notes      string    `gorm:"type:text"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}