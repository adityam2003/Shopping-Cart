import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createOrder, deleteCartItem } from '../services/api';
import './Cart.css';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
      setError('Error loading cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      setError(null);
      
      const response = await createOrder(cart.id);
      
      // Navigate to confirmation page with order details
      navigate('/order-confirmation', { 
        state: { 
          orderDetails: {
            order_id: response.order_id,
            items: cart.items,
            status: response.status
          }
        }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      try {
        await deleteCartItem(itemId);
        loadCart(); // Reload cart after deletion
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error removing item from cart. Please try again.');
      }
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to see them here!</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.image_urls || '/images/placeholder.svg'} 
                  alt={item.name} 
                />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-category">{item.category}</p>
                <div className="item-quantity">
                  <span>Quantity: {item.quantity}</span>
                </div>
              </div>
              <div className="item-price">
                <span className="currency">$</span>
                <span className="amount">{(item.price * item.quantity).toFixed(2)}</span>
                <div className="price-per-item">
                  ${item.price} each
                </div>
              </div>
              <button 
                className="delete-item-btn"
                onClick={() => handleDeleteItem(item.id)}
                title="Remove item"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>Included</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-actions">
            <button 
              className={`checkout-button ${checkingOut ? 'loading' : ''}`}
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? (
                <>
                  <div className="button-spinner"></div>
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
              disabled={checkingOut}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;