package models

import "time"

type ExamAnswer struct {
	ID              uint      `gorm:"primaryKey"`
	ExamID          uint      `gorm:"not null;uniqueIndex:idx_exam_student"`
	StudentID       uint      `gorm:"not null;uniqueIndex:idx_exam_student"`
	ExamQuestionID  uint      `gorm:"not null;uniqueIndex:idx_exam_student_question"`
	Answer          string    `gorm:"size:1"`
	IsCorrect       bool      `gorm:"default:false"`
	Score           float64   `gorm:"not null;default:0"`
	AnsweredAt      time.Time
	CreatedAt       time.Time
	UpdatedAt       time.Time
}