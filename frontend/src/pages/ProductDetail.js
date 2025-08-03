import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, addToCart } from '../services/api';
import './ProductDetail.css';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getItem(id);
      setProduct(data);
    } catch (error) {
      setError('Error loading product. Please try again.');
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setError(null);
      
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.setItem('redirectPath', window.location.pathname);
        navigate('/login');
        return;
      }

      // Add to cart with quantity
      await addToCart(product.id, quantity);
      
      // Show success message and offer to view cart
      const viewCart = window.confirm('Item added to cart successfully! Would you like to view your cart?');
      if (viewCart) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Error adding item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <div className="product-image-section">
          <img 
            src={product.image_urls} 
            alt={product.name} 
            className="product-main-image"
          />
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-brand">
              BY <span>{product.brand}</span>
            </div>
          </div>

          <div className="product-pricing">
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">{product.price}</span>
            </div>
            <div className="price-info">
              <span className="save-tag">Save 12%</span>
              <span className="tax-info">Inclusive of all Taxes</span>
            </div>
          </div>

          <div className="product-description">
            {product.description}
          </div>

          <div className="purchase-section">
            <div className="quantity-select">
              <label htmlFor="quantity">QTY</label>
              <select 
                id="quantity"
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={addingToCart}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <button 
              className={`add-to-cart-button ${addingToCart ? 'loading' : ''}`}
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? (
                <>
                  <div className="button-spinner"></div>
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="review-section">
            <div className="reviewer-info">
              <img 
                src="/images/person.jpg" 
                alt="Alex Parkinson" 
                className="reviewer-avatar"
              />
              <div className="review-content">
                <h3>Alex Parkinson</h3>
                <h4>Good Product for Daily Use</h4>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;