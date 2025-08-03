package models

type User struct {
	ID        int    `json:"id" gorm:"primary_key"`
	Username  string `json:"username" gorm:"type:varchar"`
	Password  string `json:"password" gorm:"type:varchar"`
	Token     string `json:"token" gorm:"type:varchar"`
	CartID    int    `json:"cart_id" gorm:"type:int"`
	CreatedAt string `json:"created_at" gorm:"type:timestamp"`
}
