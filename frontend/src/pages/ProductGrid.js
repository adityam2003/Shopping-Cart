import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../services/api';
import './ProductGrid.css';

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="grid-header">
        <h1 className="grid-title">All Products</h1>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="products-count">
        Showing {filteredProducts.length} products
      </div>

      <div className="product-cards-grid">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="card-content">
              <div className="card-header">
                <span className="product-category">{product.category}</span>
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
              </div>

              <div className="product-image-container">
                <img 
                  src={product.image_urls} 
                  alt={product.name}
                  className="product-image"
                />
              </div>

              <div className="product-footer">
                <div className="product-price">
                  <span className="currency">$</span>
                  <span className="amount">{product.price}</span>
                </div>
                <button className="view-details-btn">
                  <span className="arrow-icon">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;