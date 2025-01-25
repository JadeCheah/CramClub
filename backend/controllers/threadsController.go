package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"CramClub-backend/models"
)

func GetThreads(c *gin.Context) {
	var threads []models.Thread

	//handles sorting of threads
	sort := c.DefaultQuery("sort", "createdAt") //accepts "createdAt" or "ratings" as sorting parameter
	var dbQuery *gorm.DB = models.DB
	switch sort {
	case "createdAt":
		dbQuery = dbQuery.Order("created_at DESC")
	case "ratings":
		dbQuery = dbQuery.Order("ratings DESC")
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sort parameter"})
		return
	}
	// Filter by user if a query parameter is provided (e.g., ?user=<id>)
	if filterUserID := c.Query("user"); filterUserID != "" {
		dbQuery = dbQuery.Where("user_id = ?", filterUserID)
	}

	//fetch threads
	if err := dbQuery.Preload("Author").Preload("Tags").Find(&threads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Return the threads as JSON
	c.JSON(http.StatusOK, gin.H{"threads": threads})

}

func CreateThread(c *gin.Context) {
	var input struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	//bind JSON payload to thread struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	//get userID from the context, which is set by the AuthMiddleware
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	//create the thread with the associated userID
	thread := models.Thread{
		Title:   input.Title,
		Content: input.Content,
		UserID:  userID.(uint),
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
	log.Println("Received request to update thread with id:", id)

	var thread models.Thread

	//check if the thread exists
	if err := models.DB.First(&thread, id).Error; err != nil {
		log.Println("Thread not found with id:", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}
	log.Println("Thread found:", thread)

	// Bind the JSON payload to the input struct
	var input struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Println("Invalid input:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	log.Println("Received input:", input)

	// Update the thread with the new values
	thread.Title = input.Title
	thread.Content = input.Content
	log.Println("Updated thread with new values:", thread)

	// //bind the JSON payload to the thread struct
	// if err := c.ShouldBindJSON(&thread); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
	// 	return
	// }

	//save the updated thread
	if err := models.DB.Save(&thread).Error; err != nil {
		log.Println("Failed to update thread:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update update thread"})
		return
	}

	//return the updated thread
	log.Println("Thread updated successfully:", thread)
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
