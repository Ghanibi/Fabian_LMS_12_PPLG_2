package models

import "time"

type ExamQuestion struct {
	ID            uint      `gorm:"primaryKey"`
	ExamID        uint      `gorm:"not null"`
	Question      string    `gorm:"type:text;not null"`
	QuestionType  string    `gorm:"size:20;not null"`
	OptionA       string    `gorm:"size:255"`
	OptionB       string    `gorm:"size:255"`
	OptionC       string    `gorm:"size:255"`
	OptionD       string    `gorm:"size:255"`
	OptionE       string    `gorm:"size:255"`
	CorrectAnswer string    `gorm:"size:10"`
	Score         float64   `gorm:"not null;default:0"`
	OrderNumber   int       `gorm:"not null"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}