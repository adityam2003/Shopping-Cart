package handlers

import (
	"net/http"
	"shopping-cart/config"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

func AddToCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var input struct {
		ItemID   int `json:"item_id" binding:"required"`
		Quantity int `json:"quantity" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify item exists
	var item models.Item
	if err := config.DB.First(&item, input.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Find or create active cart
	var cart models.Cart
	result := config.DB.Where("user_id = ? AND status = ?", userID, "active").First(&cart)
	if result.Error != nil {
		// Create new cart
		cart = models.Cart{
			UserID: userID.(int),
			Status: "active",
			Name:   "Shopping Cart",
		}
		if err := config.DB.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating cart"})
			return
		}
	}

	// Check if item already exists in cart
	var existingCartItem models.CartItem
	result = config.DB.Where("cart_id = ? AND item_id = ?", cart.ID, input.ItemID).First(&existingCartItem)

	if result.Error == nil {
		// Item exists, update quantity
		existingCartItem.Quantity += input.Quantity
		if err := config.DB.Save(&existingCartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating cart item"})
			return
		}
	} else {
		// Item doesn't exist, create new cart item
		cartItem := models.CartItem{
			CartID:   cart.ID,
			ItemID:   input.ItemID,
			Quantity: input.Quantity,
		}

		if err := config.DB.Create(&cartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error adding item to cart"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item added to cart successfully",
		"cart_id": cart.ID,
		"item":    item,
	})
}

func GetUserCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var cart models.Cart
	result := config.DB.Where("user_id = ? AND status = ?", userID, "active").First(&cart)
	if result.Error != nil {
		// Return empty cart if none exists
		c.JSON(http.StatusOK, gin.H{
			"id":     0,
			"status": "empty",
			"items":  []gin.H{},
		})
		return
	}

	// Get cart items with their details and quantities, grouped by item_id
	var cartItems []models.CartItem
	if err := config.DB.Where("cart_id = ?", cart.ID).Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching cart items"})
		return
	}

	// Group items by item_id and sum quantities
	itemQuantities := make(map[int]int)
	for _, cartItem := range cartItems {
		itemQuantities[cartItem.ItemID] += cartItem.Quantity
	}

	var itemsWithQuantity []gin.H
	for itemID, totalQuantity := range itemQuantities {
		var item models.Item
		if err := config.DB.First(&item, itemID).Error; err != nil {
			continue
		}

		itemsWithQuantity = append(itemsWithQuantity, gin.H{
			"id":          item.ID,
			"name":        item.Name,
			"price":       item.Price,
			"category":    item.Category,
			"brand":       item.Brand,
			"description": item.Description,
			"image_urls":  item.ImageURLs,
			"quantity":    totalQuantity,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"id":     cart.ID,
		"status": cart.Status,
		"items":  itemsWithQuantity,
	})
}

func cleanupDuplicateCartItems(cartID int) error {
	// Get all cart items for this cart
	var cartItems []models.CartItem
	if err := config.DB.Where("cart_id = ?", cartID).Find(&cartItems).Error; err != nil {
		return err
	}

	// Group by item_id and sum quantities
	itemQuantities := make(map[int]int)
	for _, cartItem := range cartItems {
		itemQuantities[cartItem.ItemID] += cartItem.Quantity
	}

	// Delete all existing cart items for this cart
	if err := config.DB.Where("cart_id = ?", cartID).Delete(&models.CartItem{}).Error; err != nil {
		return err
	}

	// Create new cart items with merged quantities
	for itemID, totalQuantity := range itemQuantities {
		cartItem := models.CartItem{
			CartID:   cartID,
			ItemID:   itemID,
			Quantity: totalQuantity,
		}
		if err := config.DB.Create(&cartItem).Error; err != nil {
			return err
		}
	}

	return nil
}

func CleanupCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var cart models.Cart
	result := config.DB.Where("user_id = ? AND status = ?", userID, "active").First(&cart)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active cart found"})
		return
	}

	if err := cleanupDuplicateCartItems(cart.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error cleaning up cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart cleaned up successfully"})
}

func DeleteCartItem(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var input struct {
		ItemID int `json:"item_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user's active cart
	var cart models.Cart
	if err := config.DB.Where("user_id = ? AND status = ?", userID, "active").First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active cart found"})
		return
	}

	// Delete the cart item
	if err := config.DB.Where("cart_id = ? AND item_id = ?", cart.ID, input.ItemID).Delete(&models.CartItem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting cart item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart successfully"})
}
