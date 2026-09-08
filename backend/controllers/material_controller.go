package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"school-management/config"
	"school-management/models"
)

type MaterialInput struct {
	ClassSubjectID uint   `json:"class_subject_id" binding:"required"`
	TeacherID      uint   `json:"teacher_id" binding:"required"`
	Title          string `json:"title" binding:"required"`
	Description    string `json:"description"`
	FileURL        string `json:"file_url"`
}

func GetMaterials(c *gin.Context) {
	var materials []models.Material
	if err := config.DB.Preload("Teacher").Find(&materials).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data materi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Berhasil mengambil data materi", "data": materials})
}

func GetMaterialByID(c *gin.Context) {
	id := c.Param("id")
	var material models.Material
	if err := config.DB.Preload("Teacher").First(&material, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Materi tidak ditemukan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Terjadi kesalahan pada server"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Berhasil mengambil detail materi", "data": material})
}

func CreateMaterial(c *gin.Context) {
	var input MaterialInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	material := models.Material{
		ClassSubjectID: input.ClassSubjectID,
		TeacherID:      input.TeacherID,
		Title:          input.Title,
		Description:    input.Description,
		FileURL:        input.FileURL,
	}

	if err := config.DB.Create(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat materi"})
		return
	}

	config.DB.Preload("Teacher").First(&material, material.ID)
	c.JSON(http.StatusCreated, gin.H{"message": "Materi berhasil ditambahkan", "data": material})
}

func UpdateMaterial(c *gin.Context) {
	id := c.Param("id")
	var material models.Material

	if err := config.DB.First(&material, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Materi tidak ditemukan"})
		return
	}

	var input MaterialInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	material.ClassSubjectID = input.ClassSubjectID
	material.TeacherID = input.TeacherID
	material.Title = input.Title
	material.Description = input.Description
	material.FileURL = input.FileURL

	if err := config.DB.Save(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui materi"})
		return
	}

	config.DB.Preload("Teacher").First(&material, material.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Materi berhasil diperbarui", "data": material})
}

func DeleteMaterial(c *gin.Context) {
	id := c.Param("id")
	var material models.Material
	if err := config.DB.First(&material, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Materi tidak ditemukan"})
		return
	}
	if err := config.DB.Delete(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus materi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Materi berhasil dihapus"})
}