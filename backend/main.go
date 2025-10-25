package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"CramClub-backend/controllers"
	"CramClub-backend/models"
	"CramClub-backend/routes"
)

// middleware function to inject the database connection to the Gin context
func InjectDB(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func initDatabase() {
	// Load environment variables from .env file
	// only load in local dev:
	if os.Getenv("APP_ENV") == "local" {
		_ = godotenv.Load() // ignore error
	}
	// if err := godotenv.Load(); err != nil {
	// 	log.Println("No .env file found, using environment variables.")
	// }

	dsn := os.Getenv("DB_DSN")
	//Database connection string
	if dsn == "" {
		// Build DSN from individual environment variables
		dsn = "host=" + os.Getenv("DB_HOST") +
			" user=" + os.Getenv("DB_USER") +
			" password=" + os.Getenv("DB_PASSWORD") +
			" dbname=" + os.Getenv("DB_NAME") +
			" port=" + os.Getenv("DB_PORT") +
			" sslmode=" + os.Getenv("DB_SSLMODE")
	}

	var err error
	models.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database: ", err)
	}
	log.Println("Database connected!")

	// List of all models to automigrate
	modelsToMigrate := []interface{}{
		&models.User{},
		&models.Thread{},
		&models.Tag{},
		// Add new models here as needed
	}

	// Automigrate all models
	if err := models.DB.AutoMigrate(modelsToMigrate...); err != nil {
		log.Fatal("Failed to migrate database schema:", err)
	}
	log.Println("Database migrated!")
}

func main() {
	initDatabase()
	r := gin.Default() //set up a gin router
	r.Use(InjectDB(models.DB))

	rawOrigins := os.Getenv("FRONTEND_URL")
	origins := []string{}
	for _, s := range strings.Split(rawOrigins, ",") {
		o := strings.TrimSpace(s)
		if o != "" {
			origins = append(origins, o)
		}
	}
	if len(origins) == 0 {
		// sensible default for local dev
		origins = []string{"http://localhost:5173"}
	}

	//Add CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_URL")},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true, // cookies or authentication tokens
		MaxAge:           12 * time.Hour,
	}))

	authController := controllers.NewAuthController(models.DB)

	//register routes
	routes.RegisterAuthRoutes(r, authController)
	routes.RegisterThreadRoutes(r, authController)
	routes.RegisterUserRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on :%s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
