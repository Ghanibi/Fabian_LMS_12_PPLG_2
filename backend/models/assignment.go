package models

import "time"

type Assignment struct {
	ID             uint         `gorm:"primaryKey"`
	ClassSubjectID uint         `gorm:"not null"`
	ClassSubject   ClassSubject `gorm:"foreignKey:ClassSubjectID"` // Relasi ke tabel class_subjects
	TeacherID      uint         `gorm:"not null"`
	Teacher        Teacher      `gorm:"foreignKey:TeacherID"`      // Relasi ke tabel teachers
	Title          string       `gorm:"size:150;not null"`
	Description    string       `gorm:"type:text"`
	DueDate        time.Time    `gorm:"not null"`
	MaxScore       float64      `gorm:"not null;default:100"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}