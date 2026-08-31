package models

import "time"

type AssignmentSubmission struct {
	ID           uint       `gorm:"primaryKey"`
	AssignmentID uint       `gorm:"not null"`
	StudentID    uint       `gorm:"not null"`
	SubmissionText string   `gorm:"type:text"`
	FileURL      string     `gorm:"size:255"`
	SubmittedAt  *time.Time
	Score        *float64
	Feedback     string     `gorm:"type:text"`
	Status       string     `gorm:"size:20;not null;default:'SUBMITTED'"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}