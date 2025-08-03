package handlers

import (
	"net/http"
	"shopping-cart/config"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get user's active cart
	var cart models.Cart
	if err := config.DB.Where("user_id = ? AND status = ?", userID, "active").First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active cart found"})
		return
	}

	// Check if cart has items
	var cartItemsCount int64
	if err := config.DB.Model(&models.CartItem{}).Where("cart_id = ?", cart.ID).Count(&cartItemsCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking cart items"})
		return
	}

	if cartItemsCount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	// Create new order
	order := models.Order{
		UserID: userID.(int),
		CartID: cart.ID,
	}

	if err := config.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating order"})
		return
	}

	// Update cart status to "ordered"
	cart.Status = "ordered"
	if err := config.DB.Save(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating cart status"})
		return
	}

	// Get order details with items
	var items []models.Item
	if err := config.DB.Table("items").
		Joins("JOIN cart_items ON cart_items.item_id = items.id").
		Where("cart_items.cart_id = ?", cart.ID).
		Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching order items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"order_id": order.ID,
		"items":    items,
		"status":   "success",
		"message":  "Order created successfully",
	})
}

func GetUserOrders(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var orders []models.Order
	if err := config.DB.Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching orders"})
		return
	}

	// Get items for each order with quantities
	var orderResponses []gin.H
	for _, order := range orders {
		var cartItems []models.CartItem
		if err := config.DB.Where("cart_id = ?", order.CartID).Find(&cartItems).Error; err != nil {
			continue
		}

		var itemsWithQuantity []gin.H
		for _, cartItem := range cartItems {
			var item models.Item
			if err := config.DB.First(&item, cartItem.ItemID).Error; err != nil {
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
				"quantity":    cartItem.Quantity,
			})
		}

		orderResponses = append(orderResponses, gin.H{
			"id":         order.ID,
			"created_at": order.CreatedAt,
			"items":      itemsWithQuantity,
		})
	}

	c.JSON(http.StatusOK, orderResponses)
}
