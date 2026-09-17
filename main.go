package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"school-management/config"
	"school-management/models"
	"school-management/routes"
	"school-management/seed"
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

	// Konfigurasi CORS agar diizinkan diakses oleh Frontend (Vite)
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Daftarkan routes
	routes.AuthRoutes(router)
	routes.UserRoutes(router)
	routes.TeacherRoutes(router)
	routes.StudentRoutes(router)
	routes.ClassRoutes(router)
	routes.SubjectRoutes(router)
	routes.MaterialRoutes(router)
	routes.AssignmentRoutes(router)
	routes.SubmissionRoutes(router)

	// Jalankan server
	log.Println("Server berjalan di http://localhost:8080")
	router.Run(":8080")
}