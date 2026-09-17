package routes

import (
	"github.com/gin-gonic/gin"
	"school-management/controllers"
	"school-management/middleware"
)

func SubmissionRoutes(router *gin.Engine) {
	subGroup := router.Group("/api/submissions")
	
	subGroup.Use(middleware.AuthMiddleware())
	{
		subGroup.GET("", middleware.RoleMiddleware("ADMIN", "TEACHER"), controllers.GetSubmissions)
		subGroup.POST("", middleware.RoleMiddleware("STUDENT"), controllers.SubmitAssignment)
		subGroup.PUT("/:id/grade", middleware.RoleMiddleware("ADMIN", "TEACHER"), controllers.GradeSubmission)
	}
}