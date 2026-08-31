package main

import (
	"log"
	"school-management/config"
	"school-management/models"
	"school-management/routes"
	"school-management/seed"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Hubungkan ke Database
	config.ConnectDatabase()

	// 2. AutoMigrate semua model
	log.Println("Menjalankan AutoMigrate...")
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.EducationLevel{},
		&models.Class{},
		&models.Subject{},
		&models.Teacher{},
		&models.Student{},
		&models.ClassSubject{},
		&models.TeacherSubject{},
		&models.Material{},
		&models.Assignment{},
		&models.AssignmentSubmission{},
		&models.Exam{},
		&models.ExamQuestion{},
		&models.ExamAnswer{},
		&models.Grade{},
		&models.Announcement{},
		&models.Notification{},
		&models.AcademicEvent{},
	)
	if err != nil {
		log.Fatalf("Gagal melakukan AutoMigrate: %v", err)
	}
	log.Println("AutoMigrate berhasil.")

	// 3. Jalankan Seeder
	seed.SeedEducationLevels()
	seed.SeedClasses()
	seed.SeedUsers() // Seeder user akan membuat admin dengan password ter-hash

	// 4. Setup Gin Server
	router := gin.Default()

	// Daftarkan routes
	routes.AuthRoutes(router)
	routes.UserRoutes(router) // Tambahkan baris ini

	// Jalankan server
	log.Println("Server berjalan di http://localhost:8080")
	router.Run(":8080")
}
