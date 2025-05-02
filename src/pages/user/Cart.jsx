import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';
import { getCart, deleteItemInCart, updateItemInCart } from '@services/CartService';
import { createAxios } from '@utils/createInstance.jsx';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';

const Cart = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);

      const response = await getCart(accessToken, axiosJWT);

      // Kiểm tra nếu response có cấu trúc như trong ảnh
      if (response.success && response.data) {
        // Chuyển đổi object items thành array
        const itemsArray = [];
        for (let key in response.data) {
          if (!isNaN(parseInt(key))) {
            // Chuyển đổi dữ liệu từ format của API sang format component
            const item = response.data[key];
            itemsArray.push({ ...item });
          }
        }
        setCartItems(itemsArray);
      } else {
        // Nếu response đã là mảng, sử dụng trực tiếp
        setCartItems(response);
      }
    } catch (err) {
      setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, change, oldQuantity) => {
    try {
      const newQuantity = oldQuantity + change;
      if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1

      const formData = {
        productId: itemId,
        quantity: newQuantity,
      };

      const response = await updateItemInCart(formData, accessToken, axiosJWT);

      if (response.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleQuantityInput = async (itemId, value) => {
    try {
      const newQuantity = parseInt(value);
      if (isNaN(newQuantity) || newQuantity < 1) return; // Kiểm tra giá trị hợp lệ

      const formData = {
        productId: itemId,
        quantity: newQuantity,
      };

      const response = await updateItemInCart(formData, accessToken, axiosJWT);

      if (response.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    await deleteItemInCart(itemId, accessToken, axiosJWT);
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  const handleApplyCoupon = () => {
    // Placeholder for apply coupon handler
    console.log('Apply coupon:', couponCode);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item._id)) {
        const discountedPrice = item.price - item.price * (item.discount / 100);
        return total + discountedPrice * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateCouponDiscount = () => {
    // Placeholder for coupon discount calculation
    return 0;
  };

  const calculateShipping = () => {
    // Placeholder for shipping calculation
    return calculateSubtotal() > 0 ? 30000 : 0; // Phí vận chuyển mặc định 30,000 đồng
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateCouponDiscount() + calculateShipping();
  };

  console.log('Cart items:', cartItems);
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
            <div className="cart__select-all">
              <input type="checkbox" checked={selectedItems.length === cartItems.length} onChange={handleSelectAll} />
              <span>Chọn tất cả</span>
            </div>
            {cartItems.map((item) => (
              <div key={item._id} className="cart__item">
                <div className="cart__item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelectItem(item._id)}
                  />
                </div>
                <div className="cart__item-image">
                  <img src={item.images[0].url} alt={item.name} />
                </div>

                <div className="cart__item-details">
                  <h3 className="cart__item-name">{item.name}</h3>
                  <p className="cart__item-seller"></p>
                  <p className="cart__item-weight"></p>

                  <div className="cart__item-price">
                    <span className="current-price">
                      {(item.price - item.price * (item.discount / 100)).toLocaleString()}/{item.unit}
                    </span>
                    <span className="original-price">{item.price.toLocaleString()}đồng</span>{' '}
                    <span className="savings">
                      Tiết kiệm : {(item.price - (item.price - item.price * (item.discount / 100))).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="cart__item-quantity">
                  <div className="quantity-label">Số lượng</div>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1, item.quantity)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="number"
                      className="quantity-value"
                      value={item.quantity}
                      onChange={(e) => handleQuantityInput(item._id, e.target.value)}
                      min="1"
                    />
                    <button onClick={() => handleQuantityChange(item._id, 1, item.quantity)} className="quantity-btn">
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>

                <div className="cart__item-total">
                  <div className="total-label">Thành tiền</div>
                  <div className="total-value">
                    {((item.price - item.price * (item.discount / 100)) * item.quantity).toLocaleString()}
                  </div>
                </div>

                <div className="cart__item-actions">
                  <button className="remove" onClick={() => handleRemoveItem(item._id)}>
                    Remove
                  </button>
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
                <span>Thành tiền</span>
                <span>{calculateSubtotal().toLocaleString()} đồng</span>
              </div>
              <div className="coupon-discount">
                <span>Mã giảm giá</span>
                <span>{/* (-) ${couponDiscount.toFixed(2)} */}</span>
              </div>
              <div className="shipping">
                <span>Phí vận chuyển</span>
                <span>{/* ${shipping.toFixed(2)} */}</span>
              </div>
              <div className="total">
                <span>Tổng</span>
                <span className="total-amount">{calculateTotal().toLocaleString()} đồng</span>
              </div>
            </div>
            <Link to="/checkout" state={{ selectedItems }}>
              <button className="checkout-btn" disabled={selectedItems.length === 0}>
                Thanh toán ({selectedItems.length} sản phẩm)
              </button>
            </Link>
            <Link to="/product" className="return-link">
              <FontAwesomeIcon icon={faArrowLeft} /> Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
