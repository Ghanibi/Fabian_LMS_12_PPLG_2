package seed

import (
	"log"
	"strconv"
	"strings"

	"school-management/config"
	"school-management/models"
)

func SeedClasses() {
	// 1. Buat atau cari Education Level untuk "SMK"
	var smk models.EducationLevel
	config.DB.Where("name = ?", "SMK").FirstOrCreate(&smk, models.EducationLevel{Name: "SMK"})

	// 2. Daftar lengkap kelas SMK sesuai request
	classNames := []string{
		"10 DKV PLUS", "10 DKV 1", "10 DKV 2", "10 TJKT PLUS", "10 TJKT 1", "10 TJKT 2", "10 TJKT 3", "10 TJKT 4", "10 TJKT 5", "10 PPLG 1", "10 PPLG 2", "10 PEMASARAN 1", "10 PEMASARAN 2", "10 MPLB PLUS", "10 MPLB 1", "10 MPLB 2", "10 MPLB 3", "10 MPLB 4", "10 MPLB 5",
		"11 DKV PLUS", "11 DKV 1", "11 DKV 2", "11 TJKT PLUS", "11 TJKT 1", "11 TJKT 2", "11 TJKT 3", "11 TJKT 4", "11 TJKT 5", "11 TJKT 6", "11 TJKT 7", "11 PPLG 1", "11 PPLG 2", "11 PEMASARAN 1", "11 PEMASARAN 2", "11 PEMASARAN 3", "11 MPLB PLUS", "11 MPLB 1", "11 MPLB 2", "11 MPLB 3", "11 MPLB 4", "11 MPLB 5",
		"12 DKV PLUS", "12 DKV 1", "12 DKV 2", "12 TJKT PLUS", "12 TJKT 1", "12 TJKT 2", "12 TJKT 3", "12 TJKT 4", "12 TJKT 5", "12 TJKT 6", "12 TJKT 7", "12 PPLG 1", "12 PPLG 2", "12 PEMASARAN 1", "12 PEMASARAN 2", "12 PEMASARAN 3", "12 MPLB PLUS", "12 MPLB 1", "12 MPLB 2", "12 MPLB 3", "12 MPLB 4", "12 MPLB 5",
	}

	// 3. Masukkan ke database
	for _, name := range classNames {
		// Ekstrak angka kelas (10, 11, 12) dari 2 karakter pertama
		grade, _ := strconv.Atoi(name[:2])

		// Ekstrak jurusan (misal: "DKV", "TJKT") dari kata kedua
		parts := strings.Split(name, " ")
		major := ""
		if len(parts) > 1 {
			major = parts[1]
		}

		// Deteksi apakah nama kelas mengandung kata "PLUS"
		isPlus := strings.Contains(name, "PLUS")

		var class models.Class
		// FirstOrCreate memastikan tidak ada duplikat data saat seeder dijalankan berkali-kali
		config.DB.Where("name = ?", name).FirstOrCreate(&class, models.Class{
			Name:             name,
			EducationLevelID: smk.ID,
			Grade:            grade,
			Major:            major,
			IsPlus:           isPlus,
		})
	}

	log.Println("Seeder Kelas SMK berhasil dijalankan.")
}