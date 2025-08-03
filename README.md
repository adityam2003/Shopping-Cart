# Shopping Cart Application

This is a simple e-commerce application with a Go backend and React frontend.

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Run the server:
```bash
go run main.go
```

The server will start on http://localhost:8080

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on http://localhost:3000

## API Endpoints

### User Endpoints
- `POST /users` - Create a new user
- `GET /users` - List all users
- `POST /users/login` - Login with username and password

### Item Endpoints
- `POST /items` - Create a new item
- `GET /items` - List all items

### Cart Endpoints (Protected)
- `POST /carts` - Add item to cart
- `GET /carts` - List all carts
- `GET /carts/me` - Get current user's cart

### Order Endpoints (Protected)
- `POST /orders` - Create order from cart
- `GET /orders` - List all orders
- `GET /orders/me` - Get current user's orders

## Testing the Application

1. First, create a new user using the `/users` endpoint
2. Login using the `/users/login` endpoint to get a token
3. Use the token in the Authorization header for protected endpoints
4. Create some items using the `/items` endpoint
5. Add items to cart using the `/carts` endpoint
6. Create an order using the `/orders` endpoint

## Frontend Features

1. Login Screen
   - Enter username and password
   - Shows alert on invalid credentials

2. Items List Screen
   - Displays all available items
   - Click on an item to add it to cart
   - Checkout button to create order
   - Cart button to view current cart items
   - Order History button to view past orders