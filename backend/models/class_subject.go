package models

import "time"

type ClassSubject struct {
	ID        uint `gorm:"primaryKey"`
	ClassID   uint `gorm:"not null;uniqueIndex:idx_class_subject"`
	SubjectID uint `gorm:"not null;uniqueIndex:idx_class_subject"`
	CreatedAt time.Time
	UpdatedAt time.Time
}