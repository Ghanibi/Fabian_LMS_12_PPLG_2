package models

import "time"

type AssignmentSubmission struct {
	ID             uint       `gorm:"primaryKey"`
	AssignmentID   uint       `gorm:"not null"`
	Assignment     Assignment `gorm:"foreignKey:AssignmentID"`
	StudentID      uint       `gorm:"not null"`
	Student        Student    `gorm:"foreignKey:StudentID"`
	SubmissionText string     `gorm:"type:text"`
	FileURL        string     `gorm:"size:255"`
	SubmittedAt    *time.Time
	Score          *float64
	Feedback       string     `gorm:"type:text"`
	Status         string     `gorm:"size:20;not null;default:'SUBMITTED'"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}