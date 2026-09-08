package routes

import (
	"github.com/gin-gonic/gin"
	"school-management/controllers"
	"school-management/middleware"
)

func SubjectRoutes(router *gin.Engine) {
	subjectGroup := router.Group("/api/subjects")
	
	subjectGroup.Use(middleware.AuthMiddleware())
	subjectGroup.Use(middleware.RoleMiddleware("ADMIN"))
	{
		subjectGroup.GET("", controllers.GetSubjects)
		subjectGroup.GET("/:id", controllers.GetSubjectByID)
		subjectGroup.POST("", controllers.CreateSubject)
		subjectGroup.PUT("/:id", controllers.UpdateSubject)
		subjectGroup.DELETE("/:id", controllers.DeleteSubject)
	}
}