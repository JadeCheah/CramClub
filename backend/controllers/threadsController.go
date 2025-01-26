package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"CramClub-backend/models"
)

// Different from GetThread, this function returns all threads with filtering and sorting
func GetThreads(c *gin.Context) {
	var threads []models.Thread
	dbQuery := models.DB.Preload("Author").Preload("Tags")

	//handles sorting of threads
	sort := c.DefaultQuery("sort", "createdAt") //accepts "createdAt" or "ratings" as sorting parameter

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

	// Filter by tag if a query parameter is provided
	if tag := c.Query("tag"); tag != "" {
		dbQuery = dbQuery.Joins("JOIN thread_tags ON thread_tags.thread_id = threads.id").
			Joins("JOIN tags ON tags.id = thread_tags.tag_id").
			Where("tags.name = ?", tag)
	}

	// Search by title if a query parameter is provided
	if search := c.Query("search"); search != "" {
		dbQuery = dbQuery.Where("title ILIKE ?", "%"+search+"%")
	}

	//fetch threads
	if err := dbQuery.Find(&threads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Return the threads as JSON
	c.JSON(http.StatusOK, gin.H{"threads": threads})

}

// Different from GetThreads, this function returns a single thread
func GetThread(c *gin.Context) {
	id := c.Param("id")
	var thread models.Thread

	// Fetch thread with given ID
	if err := models.DB.Preload("Author").Preload("Tags").First(&thread, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}
	c.JSON(http.StatusOK, thread)
}

func CreateThread(c *gin.Context) {
	var input struct {
		Title   string   `json:"title"`
		Content string   `json:"content"`
		Tags    []string `json:"tags"`
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

	// Create or find tags
	var tags []models.Tag
	for _, tagName := range input.Tags {
		var tag models.Tag
		if err := models.DB.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{Name: tagName}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to handle tags"})
			return
		}
		tags = append(tags, tag)
	}

	//create the thread with the associated userID
	thread := models.Thread{
		Title:   input.Title,
		Content: input.Content,
		Tags:    tags,
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

	var thread models.Thread

	//check if the thread exists
	if err := models.DB.First(&thread, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
		return
	}

	// Bind the JSON payload to the input struct
	var input struct {
		Title   string   `json:"title"`
		Content string   `json:"content"`
		Tags    []string `json:"tags"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Create or find tags
	var tags []models.Tag
	for _, tagName := range input.Tags {
		var tag models.Tag
		if err := models.DB.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{Name: tagName}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to handle tags"})
			return
		}
		tags = append(tags, tag)
	}

	// Update the thread
	thread.Title = input.Title
	thread.Content = input.Content
	thread.Tags = tags

	// //bind the JSON payload to the thread struct
	// if err := c.ShouldBindJSON(&thread); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
	// 	return
	// }

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
