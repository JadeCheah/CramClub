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

func RegisterProfileRoutes(router *gin.Engine, authController *controllers.AuthController) {
	profile := router.Group("/profile")
	profile.Use(authController.AuthMiddleware()) // Protect the profile route

	profile.GET("/", controllers.GetProfile) // Fetch the user's profile
}
