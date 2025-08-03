package handlers

import (
	"net/http"
	"shopping-cart/config"
	"shopping-cart/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetItems(c *gin.Context) {
	var items []models.Item
	result := config.DB.Find(&items)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching items"})
		return
	}

	if len(items) == 0 {
		c.JSON(http.StatusOK, []models.Item{})
		return
	}

	c.JSON(http.StatusOK, items)
}

func GetItem(c *gin.Context) {
	id := c.Param("id")
	itemID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	var item models.Item
	result := config.DB.First(&item, itemID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	c.JSON(http.StatusOK, item)
}
