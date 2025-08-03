import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../services/api';
import './ItemsList.css';

function ItemsList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="items-container">
      <div className="hero-section">
        <div className="hero-content">
          <span className="subtitle">Music is Classic</span>
          <h1 className="title">Sequoia Inspiring Musico.</h1>
          <div className="feature">
            <span className="feature-number">01</span>
            <div className="feature-content">
              <h3>Clear Sounds</h3>
              <p>Making your dream music come true stay with Sequoia Sounds!</p>
            </div>
          </div>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/products')}
          >
            View All Products
          </button>
        </div>
        <div className="hero-image">
          <img src="/images/headphone.png" alt="Blue Headphones" className="main-product-image" />
        </div>
      </div>

      <div className="products-grid">
        <div 
          className="product-card featured"
          onClick={() => handleProductClick(1)}
        >
          <h3>New Gen</h3>
          <h2>X-Bud</h2>
          <p>Premium Wireless Earbuds</p>
          <img src="/images/earphonewired.png" alt="X-Bud" />
          <button className="view-more">→</button>
        </div>

        <div 
          className="product-card"
          onClick={() => handleProductClick(2)}
        >
          <h3>Pro Series</h3>
          <h2>Studio Max</h2>
          <p>Professional Studio Headphones</p>
          <img src="" alt="Studio Max Headphones" />
          <button className="view-more">→</button>
        </div>

        <div 
          className="product-card"
          onClick={() => handleProductClick(3)}
        >
          <h3>Light Grey Surface</h3>
          <h2>Headphone</h2>
          <p>Boosted with bass</p>
          <img src="/images/ear1.png" alt="Grey Headphone" />
          <button className="view-more">→</button>
        </div>
      </div>

      <div className="social-links">
        <p>Follow us on:</p>
        <div className="social-icons">
          <a href="#twitter"><i className="fab fa-twitter"></i></a>
          <a href="#tiktok"><i className="fab fa-tiktok"></i></a>
          <a href="#instagram"><i className="fab fa-instagram"></i></a>
          <a href="#linkedin"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>
    </div>
  );
}

export default ItemsList;