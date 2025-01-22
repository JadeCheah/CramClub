package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"CramClub-backend/models"
	"CramClub-backend/utils"
)

// Fetching basic profile details (username, createdAt)
func GetProfile(c *gin.Context) {

	// Extract token from Authorization header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
		return
	}
	token := strings.TrimPrefix(authHeader, "Bearer ")
	username, err := utils.ParseJWT(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	// Fetch user from database
	var user models.User
	if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"username": user.Username,
		"joined":   user.CreatedAt.Format("January 2, 2006"),
	})
}
