package routes

import (
	"CramClub-backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterThreadRoutes(router *gin.Engine, authController *controllers.AuthController) {
	threads := router.Group("/threads")
	threads.Use(authController.AuthMiddleware()) // Apply AuthMiddleware to all thread routes

	threads.POST("/", controllers.CreateThread)      // Add a thread
	threads.GET("/", controllers.GetThreads)         // List all threads
	threads.GET("/:id", controllers.GetThread)       // Get a single thread by ID
	threads.PUT("/:id", controllers.UpdateThread)    // Update a thread
	threads.DELETE("/:id", controllers.DeleteThread) // Delete a thread
}
