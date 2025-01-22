package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"CramClub-backend/models"
)

func GetThreads(c *gin.Context) {
	var threads []models.Thread

	db, ok := c.MustGet("db").(*gorm.DB) //get DB connection from context
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection not found"})
		return
	}

	//handles sorting of threads
	sort := c.DefaultQuery("sort", "createdAt") //accepts "createdAt" or "ratings" as sorting parameter
	switch sort {
	case "createdAt":
		db = db.Order("created_at DESC")
	case "ratings":
		db = db.Order("ratings DESC")
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sort parameter"})
		return
	}

	//fetch threads
	if err := db.Preload("Author").Preload("Tags").Find(&threads).Error; err != nil {
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

	//get userID from the context
	userID := c.GetUint("user_id")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	//bind JSON payload to thread struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	//create the thread with the associated userID
	thread := models.Thread{
		Title:   input.Title,
		Content: input.Content,
		UserID:  userID,
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
