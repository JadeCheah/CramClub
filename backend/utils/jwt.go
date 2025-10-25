package utils

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"

	"CramClub-backend/models"
)

var jwtSecret string

func init() {
	if os.Getenv("APP_ENV") == "local" {
		_ = godotenv.Load() // ignore error
	}
	//load .env file
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	jwtSecret = os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET is not set in .env file")
	}
}

// Creates a signed token for a given username
func GenerateJWT(username string) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(72 * time.Hour).Unix(), //token expires in 72 hours
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

// Parses the JWT and extracts the username
func ParseJWT(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username, ok := claims["username"].(string)
		if !ok {
			return "", errors.New("invalid token payload")
		}
		return username, nil
	}

	return "", errors.New("invalid token")
}

// Validates the token and extracts the userID
func ValidateTokenAndGetUserID(tokenString string) (uint, error) {
	log.Println("Validating token:", tokenString) //debug message
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})
	if err != nil {
		log.Println("Token parsing error:", err) // Log the specific error
		return 0, errors.New("invalid or expired token")
	}

	// if err != nil || !token.Valid {
	// 	return 0, errors.New("invalid or expired token")
	// }

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		exp, ok := claims["exp"].(float64)
		if !ok || time.Now().Unix() > int64(exp) {
			log.Println("Token is expired or missing exp claim")
			return 0, errors.New("token expired")
		}

		username, ok := claims["username"].(string)
		if !ok {
			return 0, errors.New("username not found in token")
		}

		log.Println("Valid token, username:", username) //debug message

		// Fetch user ID from the database using username
		var user models.User
		if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
			log.Println("User not found for username:", username) //debug message
			return 0, errors.New("user not found")
		}
		log.Println("User validated, userID:", user.ID) //debug message
		return user.ID, nil
	}

	log.Println("Invalid token claims") //debug message
	return 0, errors.New("invalid token claims")
}
