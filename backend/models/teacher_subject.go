package models

import "time"

type TeacherSubject struct {
	ID        uint `gorm:"primaryKey"`
	TeacherID uint `gorm:"not null;uniqueIndex:idx_teacher_subject_class"`
	SubjectID uint `gorm:"not null;uniqueIndex:idx_teacher_subject_class"`
	ClassID   uint `gorm:"not null;uniqueIndex:idx_teacher_subject_class"`
	CreatedAt time.Time
	UpdatedAt time.Time
}