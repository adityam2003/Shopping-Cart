package config

import (
	"shopping-cart/models"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var DB *gorm.DB

func InitDB() error {
	var err error
	DB, err = gorm.Open("sqlite3", "shopping_cart.db")
	if err != nil {
		return err
	}

	// Auto-migrate the models
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Cart{})
	DB.AutoMigrate(&models.Item{})
	DB.AutoMigrate(&models.Order{})
	DB.AutoMigrate(&models.CartItem{})

	// Initialize sample products if none exist
	var count int
	DB.Model(&models.Item{}).Count(&count)
	if count == 0 {
		createSampleProducts()
	}

	return nil
}

func createSampleProducts() {
	// Available images from frontend/src/images
	availableImages := []string{
		"/images/earphonewired.png",
		"/images/headphone.png",
		"/images/ear1.png",
		"/images/ear2.avif",
		"/images/speaker1.png",
		"/images/speaker.jpg",
	}

	sampleItems := []models.Item{
		{
			Name:        "X-Bud Pro",
			Status:      "active",
			Description: "Premium Wireless Earbuds with active noise cancellation, 24-hour battery life, and crystal clear sound quality",
			Price:       199.99,
			Category:    "Earbuds",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[0], // earphonewired.png
		},
		{
			Name:        "Studio Max",
			Status:      "active",
			Description: "Professional Studio Headphones with high-resolution audio and premium build quality",
			Price:       299.99,
			Category:    "Professional",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[1], // headphone.png
		},
		{
			Name:        "Bass Boost Pro",
			Status:      "active",
			Description: "Over-ear headphones with enhanced bass response and comfortable fit",
			Price:       249.99,
			Category:    "Headphones",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[2], // ear1.png
		},
		{
			Name:        "Gaming Elite",
			Status:      "active",
			Description: "Gaming headset with 7.1 surround sound and noise-canceling microphone",
			Price:       349.99,
			Category:    "Gaming",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[3], // ear2.avif
		},
		{
			Name:        "Sport Wireless",
			Status:      "active",
			Description: "Sweat-resistant wireless earbuds perfect for workouts and running",
			Price:       129.99,
			Category:    "Sports",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[4], // speaker1.png
		},
		{
			Name:        "DJ Master",
			Status:      "active",
			Description: "Professional DJ headphones with superior sound isolation and durability",
			Price:       399.99,
			Category:    "Professional",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[5], // speaker.jpg
		},
		{
			Name:        "Kids Safe",
			Status:      "active",
			Description: "Volume-limited headphones designed specifically for children's safety",
			Price:       89.99,
			Category:    "Kids",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[0], // earphonewired.png
		},
		{
			Name:        "Travel Elite",
			Status:      "active",
			Description: "Foldable travel headphones with active noise cancellation",
			Price:       279.99,
			Category:    "Travel",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[1], // headphone.png
		},
		{
			Name:        "Classic Studio",
			Status:      "active",
			Description: "Classic studio monitoring headphones for professional audio production",
			Price:       449.99,
			Category:    "Professional",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[2], // ear1.png
		},
		{
			Name:        "Workout Plus",
			Status:      "active",
			Description: "Over-ear workout headphones with sweat resistance and secure fit",
			Price:       199.99,
			Category:    "Sports",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[3], // ear2.avif
		},
		{
			Name:        "True Wireless Pro",
			Status:      "active",
			Description: "Premium true wireless earbuds with ambient sound mode",
			Price:       259.99,
			Category:    "Earbuds",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[4], // speaker1.png
		},
		{
			Name:        "Studio Reference",
			Status:      "active",
			Description: "Reference-grade studio headphones for mixing and mastering",
			Price:       499.99,
			Category:    "Professional",
			Brand:       "ShopCart",
			ImageURLs:   availableImages[5], // speaker.jpg
		},
	}

	for _, item := range sampleItems {
		DB.Create(&item)
	}
}
