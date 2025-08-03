package main

import (
	"log"
	"shopping-cart/config"
	"shopping-cart/handlers"
	"shopping-cart/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	if err := config.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer config.DB.Close()

	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Public routes
	r.POST("/users", handlers.SignUp)
	r.POST("/users/login", handlers.Login)
	r.GET("/items", handlers.GetItems)
	r.GET("/items/:id", handlers.GetItem)

	// Protected routes
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Cart routes
		protected.POST("/carts", handlers.AddToCart)
		protected.GET("/carts/me", handlers.GetUserCart)
		protected.POST("/carts/cleanup", handlers.CleanupCart)
		protected.DELETE("/carts/items", handlers.DeleteCartItem)

		// Order routes
		protected.POST("/orders", handlers.CreateOrder)
		protected.GET("/orders/me", handlers.GetUserOrders)
	}

	r.Run(":8080")
}
