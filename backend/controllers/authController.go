package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"CramClub-backend/models"
	"CramClub-backend/utils"
)

type AuthController struct {
	DB *gorm.DB
}

// NewAuthController creates a new instance of AuthController
func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{DB: db}
}

func (ctrl *AuthController) Signup(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	//validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Username:     input.Username,
		PasswordHash: string(hashedPassword),
	}

	if err := ctrl.DB.Create(&user).Error; err != nil {
		if ctrl.DB.Error.Error() == "UNIQUE	constraint failed: user.username" {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User created successfully!"})
}

func (ctrl *AuthController) Login(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := ctrl.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(input.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Login successful",
		"username": user.Username,
		"token":    token,
	})
}

// func (ctrl *AuthController) AuthMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		//retrieve the token from the Authorization header
// 		token := c.GetHeader("Authorization")
// 		if token == "" {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token is required"})
// 			return
// 		}

// 		//validate the token and extract userID
// 		userID, err := utils.ValidateTokenAndGetUserID(token)
// 		if err != nil {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
// 			return
// 		}

// 		//set the userID in the context for subsequent handlers
// 		c.Set("user_id", userID)
// 		c.Next()
// 	}
// }
