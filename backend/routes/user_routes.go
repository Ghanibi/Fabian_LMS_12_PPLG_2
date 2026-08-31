package routes

import (
	"school-management/controllers"
	"school-management/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.Engine) {
	// Grup route untuk user, diproteksi oleh AuthMiddleware dan RoleMiddleware
	userGroup := router.Group("/api/users")
	userGroup.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("ADMIN"))
	{
		userGroup.POST("/", controllers.CreateUser)
		userGroup.GET("/", controllers.GetUsers)
		userGroup.GET("/:id", controllers.GetUserByID)
		userGroup.PUT("/:id", controllers.UpdateUser)
		userGroup.DELETE("/:id", controllers.DeleteUser)
	}
}