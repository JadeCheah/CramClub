package main

import (
	"log"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"CramClub-backend/models"
	"CramClub-backend/routes"
)

var DB *gorm.DB

func initDatabase() {
	//Database connection string
	dsn := "host=localhost user=jadecheah password=dragonfly123 dbname=cramclub port=5432 sslmode=disable"

	var err error
	models.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database: ", err)
	}
	log.Println("Database connected!")

	// Perform database migration
	if err := models.DB.AutoMigrate(&models.Thread{}); err != nil {
		log.Fatal("Failed to migrate database schema:", err)
	}
	log.Println("Database migrated!")
}

func main() {
	initDatabase()
	// models.DB.Create(&models.Thread{Title: "First Thread", Content: "This is the first thread"})
	// models.DB.Create(&models.Thread{Title: "Second Thread", Content: "This is the second thread"})
	r := gin.Default() //set up a gin router

	//Add CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true, // cookies or authentication tokens
		MaxAge:           12 * time.Hour,
	}))

	routes.RegisterThreadRoutes(r) //register routes
	log.Println("Starting server on port 8080...")
	r.Run(":8080")
}
