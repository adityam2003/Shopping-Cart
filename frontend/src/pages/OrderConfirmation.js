import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};

  if (!orderDetails) {
    navigate('/cart');
    return null;
  }

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="order-confirmation">
      <div className="confirmation-content">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1>Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your order. Your order has been successfully placed.
        </p>
        
        <div className="order-details">
          <h2>Order #{orderDetails.order_id}</h2>
          
          <div className="items-list">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image_urls} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="item-price">${item.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateTotal(orderDetails.items).toFixed(2)}</span>
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
              <span>${calculateTotal(orderDetails.items).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            className="view-orders-btn"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </button>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;