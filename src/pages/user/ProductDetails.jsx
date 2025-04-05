import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
    <div className="product-details">
      {product && <Breadcrumb items={[{ text: 'Products', link: '/product' }, { text: product.name }]} />}

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
    </div>
  );
};

export default ProductDetails;
