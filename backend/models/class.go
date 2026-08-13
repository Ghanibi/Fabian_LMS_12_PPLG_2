package models

import "time"

type Class struct {
	ID              uint      `gorm:"primaryKey"`
	Name            string    `gorm:"size:100;uniqueIndex;not null"`
	EducationLevelID uint      `gorm:"not null"`
	Grade           int       `gorm:"not null"`
	Major           string    `gorm:"size:50"`
	ClassNumber     *int
	IsPlus          bool      `gorm:"default:false"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}