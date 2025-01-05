package controllers

import (
	"net/http"

	"CramClub-backend/models"

	"github.com/gin-gonic/gin"
)

func GetThreads(c *gin.Context) {
	var threads []models.Thread

	//fetch all threads from db
	if err := models.DB.Find(&threads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch threads"})
		return
	}
	// Return the threads as JSON
	c.JSON(http.StatusOK, gin.H{"threads": threads})

}

func CreateThread(c *gin.Context) {
	var thread models.Thread

	//bind JSON payload to thread struct
	if err := c.ShouldBindJSON(&thread); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	//save the thread to the database
	if err := models.DB.Create(&thread).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
		return
	}

	//return the created thread
	c.JSON(http.StatusOK, gin.H{"thread": thread})
}

func UpdateThread(c *gin.Context) {
	id := c.Param("id") //get thread id from URL
	var thread models.Thread

	//check if the thread exists
	if err := models.DB.First(&thread, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}

	//bind the JSON payload to the thread struct
	if err := c.ShouldBindJSON(&thread); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	//save the updated thread
	if err := models.DB.Save(&thread).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update update thread"})
		return
	}

	//return the updated thread
	c.JSON(http.StatusOK, gin.H{"thread": thread})
}

func DeleteThread(c *gin.Context) {
	id := c.Param("id")
	var thread models.Thread

	//check if the thread exists
	if err := models.DB.First(&thread, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}

	//delete thread from database
	if err := models.DB.Delete(&thread).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete thread"})
		return
	}

	//return success message
	c.JSON(http.StatusOK, gin.H{"message": "Thread deleted successfully"})
}
