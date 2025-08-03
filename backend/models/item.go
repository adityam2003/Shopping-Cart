package models

type Item struct {
	ID          int     `json:"id" gorm:"primary_key"`
	Name        string  `json:"name" gorm:"type:varchar"`
	Status      string  `json:"status" gorm:"type:varchar"`
	CreatedAt   string  `json:"created_at" gorm:"type:timestamp"`
	Description string  `json:"description" gorm:"type:varchar"`
	Price       float64 `json:"price" gorm:"type:decimal(10,2)"`
	Category    string  `json:"category" gorm:"type:varchar"`
	Brand       string  `json:"brand" gorm:"type:varchar"`
	ImageURLs   string  `json:"image_urls" gorm:"type:varchar"` // Comma-separated URLs
}
