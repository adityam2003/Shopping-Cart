import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/api';
import './OrderHistory.css';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  if (loading) {
    return (
      <div className="orders-container loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/')} className="back-to-shop-btn">Back to Shopping</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container empty-orders">
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet. Start shopping to see your order history!</p>
        <button onClick={() => navigate('/')} className="start-shopping-btn">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className="order-date">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="order-items">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.image_urls || '/images/placeholder.svg'} 
                      alt={item.name} 
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h4>{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      <p className="item-description">{item.description}</p>
                      <div className="item-price">
                        <span className="currency">$</span>
                        <span className="amount">{item.price.toFixed(2)}</span>
                        {item.quantity && item.quantity > 1 && (
                          <span className="quantity">× {item.quantity}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-items">No items found for this order.</p>
              )}
            </div>

            <div className="order-summary">
              <div className="order-total">
                <span>Total:</span>
                <span className="total-amount">
                  ${calculateOrderTotal(order.items).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="back-to-shop-btn">
        Back to Shopping
      </button>
    </div>
  );
}

export default OrderHistory;