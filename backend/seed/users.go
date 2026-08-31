package seed

import (
	"log"
	"school-management/config"
	"school-management/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUsers() {
	var user models.User
	emailAdmin := "admin@school.com"

	// Cek apakah user admin sudah ada
	err := config.DB.Where("email = ?", emailAdmin).First(&user).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		log.Fatalf("Gagal mengecek user admin: %v", err)
	}

	// Jika user admin tidak ditemukan (ErrRecordNotFound), maka buat baru
	if err == gorm.ErrRecordNotFound {
		log.Println("User admin tidak ditemukan, membuat user admin baru...")

		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Gagal melakukan hash password: %v", err)
		}

		// Buat user admin baru
		adminUser := models.User{
			Name:     "Admin User",
			Email:    emailAdmin,
			Password: string(hashedPassword),
			Role:     "ADMIN",
		}

		if err := config.DB.Create(&adminUser).Error; err != nil {
			log.Fatalf("Gagal membuat seeder user admin: %v", err)
		}

		log.Println("User admin berhasil dibuat!")
	} else {
		// Jika user sudah ada, tidak melakukan apa-apa
		log.Println("User admin sudah ada, seeder dilewati.")
	}
}
