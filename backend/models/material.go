package models

import "time"

type Material struct {
	ID             uint         `gorm:"primaryKey"`
	ClassSubjectID uint         `gorm:"not null"`
	ClassSubject   ClassSubject `gorm:"foreignKey:ClassSubjectID"` // Relasi ke tabel class_subjects
	TeacherID      uint         `gorm:"not null"`
	Teacher        Teacher      `gorm:"foreignKey:TeacherID"`      // Relasi ke tabel teachers
	Title          string       `gorm:"size:150;not null"`
	Description    string       `gorm:"type:text"`
	FileURL        string       `gorm:"size:255"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}