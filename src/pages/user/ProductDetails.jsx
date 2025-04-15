import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCartPlus,
  faHeart,
  faSpinner,
  faLeaf,
  faShieldAlt,
  faTruck,
  faUndo,
  faShare,
  faExclamationTriangle,
  faCheck,
  //   faMugHot,
  //   faCookie,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const [specialOffer, setSpecialOffer] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra nếu có dữ liệu từ state navigation
        const stateProduct = location.state?.product;

        if (stateProduct && stateProduct.id === parseInt(id)) {
          // Nếu có dữ liệu từ state và match với id hiện tại
          setProduct(stateProduct);
          setLoading(false);
          return;
        }

        // Tạm thời dùng dữ liệu mẫu
        const mockProduct = {
          id: parseInt(id),
          name: 'Premium Coffee Beans',
          price: 29.99,
          originalPrice: 39.99,
          images: [
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          ],
          category: 'Coffee',
          rating: 4.5,
          reviews: 128,
          description: 'Carefully selected Arabica coffee beans roasted to perfection. Rich and full-bodied flavor.',
          isOrganic: true,
          onSale: true,
          salePercentage: 25,
          inStock: true,
          stockQuantity: 50,
        };

        await new Promise((resolve) => setTimeout(resolve, 500));
        setProduct(mockProduct);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location.state]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSpecialOffer((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }

        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add scroll to top effect when product ID changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.stockQuantity, quantity + value));
    setQuantity(newQuantity);
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 0;
    const newQuantity = Math.max(1, Math.min(product.stockQuantity, value));
    setQuantity(newQuantity);
  };

  //   const handleAddToCart = () => {
  //     if (!product.inStock) return;
  //     // TODO: Implement add to cart functionality
  //     console.log('Adding to cart:', { ...product, quantity });
  //   };

  //   const handleBuyNow = () => {
  //     if (!product.inStock) return;
  //     // TODO: Implement buy now functionality
  //     console.log('Buying now:', { ...product, quantity });
  //   };

  // Tạo hàm helper để xác định icon dựa trên category
  //   const getCategoryIcon = (category) => {
  //     if (!category) return faMugHot;

  //     const categoryLower = category.toLowerCase();
  //     if (categoryLower.includes('coffee')) return faMugHot;
  //     if (categoryLower.includes('tea')) return faMugHot;
  //     if (categoryLower.includes('bakery')) return faCookie;
  //     if (categoryLower.includes('snack')) return faCookie;

  //     return faMugHot; // Default icon
  //   };

  const handleRelatedProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="product-details">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details">
        <div className="error-message">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>{error || 'Product not found'}</p>
          <Link to="/product" className="back-button">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {product && <Breadcrumb items={[{ text: 'Products', link: '/product' }, { text: product.name }]} />}
      <div className="product-details">
        <div className="product-details__container">
          {/* Images Section */}
          <div className="product-details__images">
            <div className="product-details__badges">
              {product.onSale && (
                <span className="product-details__badge product-details__badge--sale">
                  -{product.salePercentage}% OFF
                </span>
              )}
              {product.isOrganic && (
                <span className="product-details__badge product-details__badge--organic">
                  <FontAwesomeIcon icon={faLeaf} /> Organic
                </span>
              )}
            </div>

            <div className="product-details__main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>

            {product.images.length > 1 && (
              <div className="product-details__thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`product-details__thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="product-details__info">
            <h1 className="product-details__title">{product.name}</h1>

            <div className="product-details__rating">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    className={index < Math.floor(product.rating) ? 'filled' : ''}
                  />
                ))}
                <span>{product.rating}</span>
              </div>
              <span className="divider">•</span>
              <span>{product.reviews} Reviews</span>
            </div>

            <p className="product-details__description">{product.description}</p>

            <div className="product-details__price">
              <span className="current-price">
                ${(product.price * (1 - (product.salePercentage || 0) / 100)).toFixed(2)}
              </span>
              {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
            </div>

            {product.onSale && (
              <div className="product-details__special-offer">
                <h3>Special Offer Ends In:</h3>
                <div className="timer">
                  <div className="timer-block">
                    <span>{String(specialOffer.hours).padStart(2, '0')}</span>
                    <label>Hours</label>
                  </div>
                  <div className="timer-block">
                    <span>{String(specialOffer.minutes).padStart(2, '0')}</span>
                    <label>Minutes</label>
                  </div>
                  <div className="timer-block">
                    <span>{String(specialOffer.seconds).padStart(2, '0')}</span>
                    <label>Seconds</label>
                  </div>
                </div>
              </div>
            )}

            <div className="product-details__stock-status">
              {product.inStock ? (
                <span className="in-stock">
                  <FontAwesomeIcon icon={faCheck} /> In Stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="out-of-stock">
                  <FontAwesomeIcon icon={faExclamationTriangle} /> Out of Stock
                </span>
              )}
            </div>

            <div className="product-details__actions">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInput}
                  min="1"
                  max={product.stockQuantity}
                />
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stockQuantity}>
                  +
                </button>
              </div>

              <button className="add-to-cart" disabled={!product.inStock}>
                <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
              </button>

              <button className="buy-now" disabled={!product.inStock}>
                Buy Now
              </button>
            </div>

            <div className="product-details__additional-actions">
              <button>
                <FontAwesomeIcon icon={faHeart} /> Add to Wishlist
              </button>
              <button>
                <FontAwesomeIcon icon={faShare} /> Share
              </button>
            </div>

            <div className="product-details__info-blocks">
              <div className="info-block">
                <FontAwesomeIcon icon={faTruck} />
                <div className="content">
                  <h4>Free Delivery</h4>
                  <p>Free shipping on orders over $50</p>
                </div>
              </div>

              <div className="info-block">
                <FontAwesomeIcon icon={faShieldAlt} />
                <div className="content">
                  <h4>Secure Payment</h4>
                  <p>100% secure payment</p>
                </div>
              </div>

              <div className="info-block">
                <FontAwesomeIcon icon={faUndo} />
                <div className="content">
                  <h4>Easy Returns</h4>
                  <p>30 day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Reviews Section */}
        <div className="product-details__tabs">
          <div className="tabs__header">
            <button
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="tabs__content">
            {activeTab === 'description' ? (
              <div className="description-content">
                <h3>Product Description</h3>
                <div className="description-text">
                  <p>{product.description}</p>
                  <div className="product-features">
                    <h4>Key Features:</h4>
                    <ul>
                      <li>Premium Quality</li>
                      <li>100% Authentic</li>
                      <li>Carefully Selected</li>
                      <li>Best in Market</li>
                    </ul>
                  </div>
                  {product.isOrganic && (
                    <div className="organic-info">
                      <FontAwesomeIcon icon={faLeaf} />
                      <h4>Organic Product</h4>
                      <p>This product is certified organic and meets all organic farming standards.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="reviews-content">
                <div className="reviews-summary">
                  <div className="rating-overview">
                    <h3>Customer Reviews</h3>
                    <div className="average-rating">
                      <span className="rating-number">{product.rating}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <FontAwesomeIcon
                            key={index}
                            icon={faStar}
                            className={index < Math.floor(product.rating) ? 'filled' : ''}
                          />
                        ))}
                      </div>
                      <span className="total-reviews">Based on {product.reviews} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {/* Mock reviews - In a real app, these would come from an API */}
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <h4>John Doe</h4>
                          <span className="review-date">Posted on {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, starIndex) => (
                            <FontAwesomeIcon key={starIndex} icon={faStar} className={starIndex < 4 ? 'filled' : ''} />
                          ))}
                        </div>
                      </div>
                      <p className="review-text">
                        Great product! The quality is excellent and it arrived quickly. Would definitely recommend to
                        others.
                      </p>
                    </div>
                  ))}
                </div>

                <div className="write-review">
                  <button className="write-review-button">
                    <FontAwesomeIcon icon={faStar} /> Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="product-details__related">
          <h2 className="related__title">Related Products</h2>
          <div className="related__products">
            {[
              {
                id: 1,
                name: 'Large Garden Spinach & Herb Wrap Tortillas - 15oz,5ct',
                price: 27.9,
                originalPrice: 32.9,
                discount: '15%',
                rating: 3,
                reviews: 3,
                image: 'https://example.com/spinach.jpg',
                inStock: true,
              },
              {
                id: 2,
                name: 'Peach - each',
                price: 0.75,
                originalPrice: 1.75,
                discount: '55%',
                rating: 3,
                reviews: 3,
                image: 'https://example.com/peach.jpg',
                inStock: true,
              },
              {
                id: 3,
                name: 'Yellow Potatoes Whole Fresh, 5lb Bag',
                price: 0.5,
                originalPrice: 1.99,
                discount: '75%',
                rating: 3,
                reviews: 3,
                image: 'https://example.com/potatoes.jpg',
                inStock: true,
              },
              {
                id: 4,
                name: 'Fresh Cauliflower, Each',
                price: 12.79,
                originalPrice: 14.79,
                discount: '14%',
                rating: 2,
                reviews: 2,
                image: 'https://example.com/cauliflower.jpg',
                inStock: true,
              },
              {
                id: 5,
                name: 'Fresh Broccoli Crowns, Each',
                price: 11.54,
                originalPrice: 17.88,
                discount: '35%',
                rating: 3,
                reviews: 3,
                image: 'https://example.com/broccoli.jpg',
                inStock: true,
              },
              {
                id: 6,
                name: 'Fresh Purple Eggplant',
                price: 2.99,
                originalPrice: 3.99,
                discount: '25%',
                rating: 3,
                reviews: 3,
                image: 'https://example.com/eggplant.jpg',
                inStock: true,
              },
            ].map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="related__product-card"
                onClick={() => handleRelatedProductClick(relatedProduct.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-card__image">
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                  {relatedProduct.discount && <span className="discount-badge">{relatedProduct.discount}</span>}
                  <button
                    className="wishlist-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent click
                      // Add wishlist functionality here
                    }}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>
                <div className="product-card__content">
                  <h3 className="product-name">{relatedProduct.name}</h3>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={faStar}
                          className={index < relatedProduct.rating ? 'filled' : ''}
                        />
                      ))}
                    </div>
                    <span className="review-count">({relatedProduct.reviews})</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">${relatedProduct.price.toFixed(2)}</span>
                    {relatedProduct.originalPrice && (
                      <span className="original-price">${relatedProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="add-to-cart-btn" disabled={!relatedProduct.inStock}>
                    <FontAwesomeIcon icon={faCartPlus} />
                    {relatedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
