import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';
import { getCart } from '@services/CartService';
import { createAxios } from '@utils/createInstance.jsx';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';

const Cart = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCart(accessToken, axiosJWT);

      if (data && Array.isArray(data)) {
        setCartItems(data);
        console.log(data);
      } else if (data && Array.isArray(data.items)) {
        // In case the API returns an object with items array
        setCartItems(data.items);
      } else {
        setError('Dữ liệu giỏ hàng không hợp lệ');
      }
    } catch (err) {
      setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải giỏ hàng...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchCartItems}>Thử lại</button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Giỏ hàng của bạn đang trống</h2>
        <Link to="/product" className="continue-shopping">
          <FontAwesomeIcon icon={faArrowLeft} /> Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ text: 'Cart' }]} />
      <div className="cart">
        <div className="cart__container">
          <div className="cart__items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart__item">
                <div className="cart__item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart__item-details">
                  <h3 className="cart__item-name">{item.name}</h3>
                  <p className="cart__item-seller">Sold By: {item.soldBy}</p>
                  <p className="cart__item-weight">Quantity - {item.weight}</p>

                  <div className="cart__item-price">
                    <span className="current-price">${item.price.toFixed(2)}</span>
                    <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                    <span className="savings">You Save : ${(item.originalPrice - item.price).toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart__item-quantity">
                  <div className="quantity-label">Qty</div>
                  <div className="quantity-controls">
                    <button
                      // onClick={() => handleQuantityChange(item._id, -1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button /* onClick={() => handleQuantityChange(item._id, 1)}  */ className="quantity-btn">
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>

                <div className="cart__item-total">
                  <div className="total-label">Total</div>
                  <div className="total-value">${(item.price * item.quantity).toFixed(2)}</div>
                </div>

                <div className="cart__item-actions">
                  <button className="save-for-later" /* onClick={() => handleSaveForLater(item._id)} */>
                    Save for later
                  </button>
                  <button className="remove" /* onClick={() => handleRemoveItem(item._id)} */>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart__summary">
            <h2>Cart Total</h2>

            <div className="cart__coupon">
              <div className="coupon-label">Coupon Apply</div>
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter Coupon Code Here..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button /* onClick={handleApplyCoupon} */>Apply</button>
              </div>
            </div>

            <div className="cart__totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{/* ${calculateSubtotal().toFixed(2)} */}</span>
              </div>
              <div className="coupon-discount">
                <span>Coupon Discount</span>
                <span>{/* (-) ${couponDiscount.toFixed(2)} */}</span>
              </div>
              <div className="shipping">
                <span>Shipping</span>
                <span>{/* ${shipping.toFixed(2)} */}</span>
              </div>
              <div className="total">
                <span>Total (USD)</span>
                <span className="total-amount">{/* ${calculateTotal().toFixed(2)} */}</span>
              </div>
            </div>
            <Link to="/checkout">
              <button className="checkout-btn">Process To Checkout</button>
            </Link>
            <Link to="/product" className="return-link">
              <FontAwesomeIcon icon={faArrowLeft} /> Return To Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
