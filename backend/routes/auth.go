package routes

import (
	"school-management/controllers"
	"school-management/middleware"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {
	auth := router.Group("/api/auth")

	{
		auth.POST("/login", controllers.Login)
		// DAFTARKAN ROUTE BARU DI SINI
		// Route ini akan menjalankan AuthMiddleware() dulu, baru controllers.GetMe()
		auth.GET("/me", middleware.AuthMiddleware(), controllers.GetMe)
	}
}