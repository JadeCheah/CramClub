package routes

import (
	"CramClub-backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.Engine, authController *controllers.AuthController) {
	router.POST("/signup", authController.Signup)
	router.POST("/login", authController.Login)
}
