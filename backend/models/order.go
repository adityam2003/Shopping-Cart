package models

type Order struct {
	ID        int    `json:"id" gorm:"primary_key"`
	CartID    int    `json:"cart_id" gorm:"type:int"`
	UserID    int    `json:"user_id" gorm:"type:int"`
	CreatedAt string `json:"created_at" gorm:"type:timestamp"`
}
