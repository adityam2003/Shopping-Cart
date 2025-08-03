package models

type Cart struct {
	ID        int    `json:"id" gorm:"primary_key"`
	UserID    int    `json:"user_id" gorm:"type:int"`
	Name      string `json:"name" gorm:"type:varchar"`
	Status    string `json:"status" gorm:"type:varchar"`
	CreatedAt string `json:"created_at" gorm:"type:timestamp"`
}

type CartItem struct {
	CartID   int `json:"cart_id" gorm:"type:int"`
	ItemID   int `json:"item_id" gorm:"type:int"`
	Quantity int `json:"quantity" gorm:"type:int;default:1"`
}
