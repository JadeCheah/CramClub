package routes

import (
	"CramClub-backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
	userGroup := router.Group("/user")
	{
		userGroup.GET("/profile", controllers.GetProfile)
	}
}
