package main

import (
	"fmt"

	"school-management/config"
	"school-management/models"
)

func main() {
	fmt.Println("Menjalankan Backend LMS...")

	config.ConnectDatabase()

	fmt.Println("Menjalankan AutoMigrate...")

	err := config.DB.AutoMigrate(
		&models.User{},
		&models.EducationLevel{},
		&models.Class{},
	)

	if err != nil {
		fmt.Println("Gagal melakukan AutoMigrate:", err)
		return
	}

	fmt.Println("AutoMigrate berhasil!")
	fmt.Println("Backend LMS berhasil dijalankan!")
}