package routes

import (
	"CramClub-backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterThreadRoutes(router *gin.Engine) {
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	//route to get all threads
	router.GET("/threads", controllers.GetThreads)

	//route to create a new thread
	router.POST("/threads", controllers.CreateThread)

	//route to update a thread
	router.PUT("/threads/:id", controllers.UpdateThread)

	//route to delete a thread
	router.DELETE("/threads/:id", controllers.DeleteThread)
}
