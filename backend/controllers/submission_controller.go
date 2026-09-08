package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"school-management/config"
	"school-management/models"
)

type SubmitAssignmentInput struct {
	AssignmentID   uint   `json:"assignment_id" binding:"required"`
	StudentID      uint   `json:"student_id" binding:"required"`
	SubmissionText string `json:"submission_text"`
	FileURL        string `json:"file_url"`
}

type GradeSubmissionInput struct {
	Score    float64 `json:"score" binding:"required"`
	Feedback string  `json:"feedback"`
}

func GetSubmissions(c *gin.Context) {
	var submissions []models.AssignmentSubmission
	if err := config.DB.Preload("Assignment").Preload("Student").Find(&submissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pengumpulan tugas"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Berhasil mengambil data pengumpulan tugas", "data": submissions})
}

func SubmitAssignment(c *gin.Context) {
	var input SubmitAssignmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now()
	submission := models.AssignmentSubmission{
		AssignmentID:   input.AssignmentID,
		StudentID:      input.StudentID,
		SubmissionText: input.SubmissionText,
		FileURL:        input.FileURL,
		SubmittedAt:    &now,
		Status:         "SUBMITTED",
	}

	if err := config.DB.Create(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengumpulkan tugas"})
		return
	}

	config.DB.Preload("Assignment").Preload("Student").First(&submission, submission.ID)
	c.JSON(http.StatusCreated, gin.H{"message": "Tugas berhasil dikumpulkan", "data": submission})
}

func GradeSubmission(c *gin.Context) {
	id := c.Param("id")
	var submission models.AssignmentSubmission

	if err := config.DB.First(&submission, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Pengumpulan tugas tidak ditemukan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Terjadi kesalahan pada server"})
		return
	}

	var input GradeSubmissionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	submission.Score = &input.Score
	submission.Feedback = input.Feedback
	submission.Status = "GRADED"

	if err := config.DB.Save(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan nilai tugas"})
		return
	}

	config.DB.Preload("Assignment").Preload("Student").First(&submission, submission.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Tugas berhasil dinilai", "data": submission})
}