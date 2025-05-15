import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCartPlus,
  faSpinner,
  faShieldAlt,
  faTruck,
  faUndo,
  faExclamationTriangle,
  faCheck,
  //   faMugHot,
  //   faCookie,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';
import { getProduct } from '@services/ProductService';
import { addItemToCart } from '@services/CartService';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '@utils/createInstance.jsx';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { toast } from 'react-toastify';
import ProductsCategoryList from '@/components/features/products/ProdCateList.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

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

        const data = await getProduct(id);

        if (!data) {
          setError('Không tìm thấy sản phẩm nây');
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        setProduct(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location.state]);

  // Add scroll to top effect when product ID changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.quantity, quantity + value));
    setQuantity(newQuantity);
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 0;
    const newQuantity = Math.max(1, Math.min(product.quantity, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async (product) => {
    if (!product || !product._id) return;

    console.log('Add to cart:', product._id);

    const formData = {
      productId: product._id,
      quantity: quantity,
    };

    await addItemToCart(formData, dispatch, accessToken, axiosJWT);
  };

  const handleBuyNow = () => {
    if (!product || !product._id) {
      toast.error('Không thể mua sản phẩm này');
      return;
    }

    const discountedPrice = product.discountedPrice || product.price;
    const totalPrice = discountedPrice * quantity;

    const selectedProduct = {
      _id: product._id,
      name: product.name,
      images: product.images || [],
      discountedPrice,
      quantity,
      totalPrice,
    };

    const subtotal = totalPrice;
    const shipping = 30000;
    const couponDiscount = 0;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax - couponDiscount;

    const summary = {
      subtotal,
      shipping,
      couponDiscount,
      tax,
      total,
    };

    navigate('/checkout', {
      state: {
        selectedProducts: [selectedProduct],
        summary,
      },
    });
  };

  if (!product) {
    return (
      <div className="product-details">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

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
          <div className="product-details__images">
            <div className="product-details__badges">
              {product.discount && (
                <span className="product-details__badge product-details__badge--sale">-{product.discount}% OFF</span>
              )}
            </div>

            <div className="product-details__main-image">
              <img src={product.images[selectedImage].url} alt={product.name} />
            </div>

            {product.images.length > 1 && (
              <div className="product-details__thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`product-details__thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image.url} alt={`${product.name} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-details__info">
            <h1 className="product-details__title">{product.name}</h1>

            <div className="product-details__rating">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    className={index < Math.floor(product.averageRating) ? 'filled' : ''}
                  />
                ))}
                <span>{product.averageRating}</span>
              </div>
              <span className="divider">•</span>
              <span>{product.reviews} Reviews</span>
            </div>

            <div className="product-details__price">
              <span className="current-price">
                {(product.price - product.price * (product.discount / 100)).toLocaleString()}đ/{product.unit}
              </span>
              <span className="original-price">{product.price.toLocaleString()}đồng</span>
            </div>

            <div className="product-details__stock-status">
              {product.quantity ? (
                <span className="in-stock">
                  <FontAwesomeIcon icon={faCheck} /> Còn ({product.quantity} {product.unit})
                </span>
              ) : (
                <span className="out-of-stock">
                  <FontAwesomeIcon icon={faExclamationTriangle} /> hết hàng
                </span>
              )}
            </div>

            <div className="product-details__actions">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)} disabled={product.quantity <= 1}>
                  -
                </button>
                <input type="number" value={quantity} onChange={handleQuantityInput} min="1" max={product.quantity} />
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>

              <button className="add-to-cart" disabled={product.quantity <= 0} onClick={() => handleAddToCart(product)}>
                <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
              </button>

              <button className="buy-now" disabled={product.quantity <= 0} onClick={handleBuyNow}>
                Buy Now
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

        <div className="product-details__tabs">
          <div className="tabs__header">
            <button
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Thông tin
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({product.averageRating})
            </button>
          </div>

          <div className="tabs__content">
            {activeTab === 'description' ? (
              <div className="description-content">
                <h3>Thông tin sản phẩm</h3>
                <div className="description-text">
                  <div>
                    {product.description.split('\n').map((paragraph, index) => {
                      const match = paragraph.match(/^(.+?):\s*(.*)$/); // tách phần in đậm trước dấu :
                      return (
                        <p key={index} className="mb-4 leading-relaxed text-[16px] text-gray-800">
                          {match ? (
                            <>
                              <strong>{match[1]}:</strong> {match[2]}
                            </>
                          ) : (
                            paragraph
                          )}
                        </p>
                      );
                    })}
                  </div>

                  <div className="product-features">
                    <h4>Thông tin:</h4>
                    <ul>
                      {product.information.map((key, value) => (
                        <li key={value}>
                          <strong>{key.key}:</strong> {key.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="reviews-content">
                <div className="reviews-summary">
                  <div className="rating-overview">
                    <h3>Đánh giá từ khách hàng</h3>
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
              </div>
            )}
          </div>
        </div>

        <div className="product-details__related">
          <h2 className="related__title">Sản phẩm liên quan</h2>
          <ProductsCategoryList idCategory={product._idCategory._id} />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
