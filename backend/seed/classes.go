package seed

import (
	"fmt"
	"strconv"
	"strings"

	"school-management/config"
	"school-management/models"
)

func SeedClasses() {
	classes := []string{
		"10 DKV PLUS",
		"10 DKV 1",
		"10 DKV 2",
		"10 TJKT PLUS",
		"10 TJKT 1",
		"10 TJKT 2",
		"10 TJKT 3",
		"10 TJKT 4",
		"10 TJKT 5",
		"10 PPLG 1",
		"10 PPLG 2",
		"10 PEMASARAN 1",
		"10 PEMASARAN 2",
		"10 MPLB PLUS",
		"10 MPLB 1",
		"10 MPLB 2",
		"10 MPLB 3",
		"10 MPLB 4",
		"10 MPLB 5",

		"11 DKV PLUS",
		"11 DKV 1",
		"11 DKV 2",
		"11 TJKT PLUS",
		"11 TJKT 1",
		"11 TJKT 2",
		"11 TJKT 3",
		"11 TJKT 4",
		"11 TJKT 5",
		"11 TJKT 6",
		"11 TJKT 7",
		"11 PPLG 1",
		"11 PPLG 2",
		"11 PEMASARAN 1",
		"11 PEMASARAN 2",
		"11 PEMASARAN 3",
		"11 MPLB PLUS",
		"11 MPLB 1",
		"11 MPLB 2",
		"11 MPLB 3",
		"11 MPLB 4",
		"11 MPLB 5",

		"12 DKV PLUS",
		"12 DKV 1",
		"12 DKV 2",
		"12 TJKT PLUS",
		"12 TJKT 1",
		"12 TJKT 2",
		"12 TJKT 3",
		"12 TJKT 4",
		"12 TJKT 5",
		"12 TJKT 6",
		"12 TJKT 7",
		"12 PPLG 1",
		"12 PPLG 2",
		"12 PEMASARAN 1",
		"12 PEMASARAN 2",
		"12 PEMASARAN 3",
		"12 MPLB PLUS",
		"12 MPLB 1",
		"12 MPLB 2",
		"12 MPLB 3",
		"12 MPLB 4",
		"12 MPLB 5",
	}

	var sma models.EducationLevel

	if err := config.DB.
		Where("name = ?", "SMA").
		First(&sma).Error; err != nil {
		fmt.Println("SMA belum ditemukan. Jalankan SeedEducationLevels terlebih dahulu.")
		return
	}

	for _, className := range classes {
		parts := strings.Split(className, " ")

		grade, err := strconv.Atoi(parts[0])
		if err != nil {
			fmt.Println("Grade tidak valid:", className)
			continue
		}

		major := parts[1]

		isPlus := parts[2] == "PLUS"

		var classNumber *int

		if !isPlus {
			number, err := strconv.Atoi(parts[2])
			if err != nil {
				fmt.Println("Nomor kelas tidak valid:", className)
				continue
			}

			classNumber = &number
		}

		var existing models.Class

		result := config.DB.
			Where("name = ?", className).
			First(&existing)

		if result.Error == nil {
			continue
		}

		newClass := models.Class{
			Name:             className,
			EducationLevelID: sma.ID,
			Grade:            grade,
			Major:            major,
			ClassNumber:      classNumber,
			IsPlus:           isPlus,
		}

		config.DB.Create(&newClass)

		fmt.Println("Kelas dibuat:", className)
	}
}