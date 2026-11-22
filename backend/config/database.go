package config

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net"
	"os"
	"strings"
	"time"

	mysqlDriver "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() error {
	host := envOrDefault("DB_HOST", "127.0.0.1")
	port := envOrDefault("DB_PORT", "3306")
	dbName := envOrDefault("DB_NAME", "school_management")
	user := envOrDefault("DB_USER", "root")
	password := os.Getenv("DB_PASSWORD")

	dsnConfig := mysqlDriver.NewConfig()
	dsnConfig.User = user
	dsnConfig.Passwd = password
	dsnConfig.Net = "tcp"
	dsnConfig.Addr = net.JoinHostPort(host, port)
	dsnConfig.DBName = dbName
	dsnConfig.ParseTime = true
	dsnConfig.Loc = time.Local
	dsnConfig.Timeout = 15 * time.Second
	dsnConfig.ReadTimeout = 30 * time.Second
	dsnConfig.WriteTimeout = 30 * time.Second

	useTLS := strings.EqualFold(os.Getenv("DB_TLS"), "true") ||
		strings.HasSuffix(strings.ToLower(host), ".tidbcloud.com")

	if useTLS {
		caPath := os.Getenv("DB_CA_CERT_PATH")
		if caPath == "" {
			return fmt.Errorf("DB_CA_CERT_PATH wajib diisi untuk koneksi TLS TiDB Cloud")
		}

		caCert, err := os.ReadFile(caPath)
		if err != nil {
			return fmt.Errorf("gagal membaca CA certificate: %w", err)
		}

		rootCAs := x509.NewCertPool()
		if !rootCAs.AppendCertsFromPEM(caCert) {
			return fmt.Errorf("CA certificate tidak valid")
		}

		tlsConfig := &tls.Config{
			RootCAs:    rootCAs,
			ServerName: host,
			MinVersion: tls.VersionTLS12,
		}

		if err := mysqlDriver.RegisterTLSConfig("tidb-cloud", tlsConfig); err != nil {
			return fmt.Errorf("gagal mendaftarkan konfigurasi TLS: %w", err)
		}

		dsnConfig.TLSConfig = "tidb-cloud"
	}

	dsn := dsnConfig.FormatDSN()

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("gagal membuka koneksi database: %w", err)
	}

	sqlDB, err := database.DB()
	if err != nil {
		return fmt.Errorf("gagal mengambil koneksi SQL: %w", err)
	}

	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(ctx); err != nil {
		sqlDB.Close()
		return fmt.Errorf("gagal melakukan ping database: %w", err)
	}

	DB = database

	fmt.Println("Database berhasil terhubung dan diverifikasi!")
	return nil
}

func envOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
