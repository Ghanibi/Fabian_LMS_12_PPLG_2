package routes

import (
	"github.com/gin-gonic/gin"
	"school-management/controllers"
	"school-management/middleware"
)

func StudentRoutes(router *gin.Engine) {
	studentGroup := router.Group("/api/students")
	
	studentGroup.Use(middleware.AuthMiddleware())
	studentGroup.Use(middleware.RoleMiddleware("ADMIN"))
	{
		studentGroup.GET("", controllers.GetStudents)
		studentGroup.GET("/:id", controllers.GetStudentByID)
		studentGroup.POST("", controllers.CreateStudent)
		studentGroup.PUT("/:id", controllers.UpdateStudent)
		studentGroup.DELETE("/:id", controllers.DeleteStudent)
	}
}