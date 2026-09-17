package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"school-management/config"
	"school-management/models"
)

type ClassInput struct {
	Name             string `json:"name" binding:"required"`
	EducationLevelID uint   `json:"education_level_id" binding:"required"`
	Grade            int    `json:"grade" binding:"required"`
	Major            string `json:"major"`
	ClassNumber      *int   `json:"class_number"`
	IsPlus           bool   `json:"is_plus"`
}

func GetClasses(c *gin.Context) {
	var classes []models.Class
	if err := config.DB.Preload("EducationLevel").Find(&classes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data kelas"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Berhasil mengambil data kelas", "data": classes})
}

func GetClassByID(c *gin.Context) {
	id := c.Param("id")
	var class models.Class
	if err := config.DB.Preload("EducationLevel").First(&class, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Kelas tidak ditemukan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Terjadi kesalahan pada server"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Berhasil mengambil detail kelas", "data": class})
}

func CreateClass(c *gin.Context) {
	var input ClassInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	class := models.Class{
		Name:             input.Name,
		EducationLevelID: input.EducationLevelID,
		Grade:            input.Grade,
		Major:            input.Major,
		ClassNumber:      input.ClassNumber,
		IsPlus:           input.IsPlus,
	}

	if err := config.DB.Create(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat kelas, pastikan nama kelas unik"})
		return
	}
	
	config.DB.Preload("EducationLevel").First(&class, class.ID)
	c.JSON(http.StatusCreated, gin.H{"message": "Kelas berhasil ditambahkan", "data": class})
}

func UpdateClass(c *gin.Context) {
	id := c.Param("id")
	var class models.Class

	if err := config.DB.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kelas tidak ditemukan"})
		return
	}

	var input ClassInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	class.Name = input.Name
	class.EducationLevelID = input.EducationLevelID
	class.Grade = input.Grade
	class.Major = input.Major
	class.ClassNumber = input.ClassNumber
	class.IsPlus = input.IsPlus

	if err := config.DB.Save(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui kelas"})
		return
	}

	config.DB.Preload("EducationLevel").First(&class, class.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Kelas berhasil diperbarui", "data": class})
}

func DeleteClass(c *gin.Context) {
	id := c.Param("id")
	var class models.Class
	if err := config.DB.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kelas tidak ditemukan"})
		return
	}
	if err := config.DB.Delete(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus kelas"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Kelas berhasil dihapus"})
}