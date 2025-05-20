import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/ui/Breadcrumb';
import { getCart, deleteItemInCart, updateItemInCart } from '@services/CartService';
import { createAxios } from '@utils/createInstance.jsx';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './NotFound';
import PageLoad from '../PageLoad';
import cartEmpty from '@assets/icons/cart-empty.svg';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    handleSelectItem(itemId);
  };

  const handleProductClick = (product) => {
    if (!product || !product._id) return;
    navigate(`/product/${product._id}`);
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
    return 0;
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 0 ? 30000 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateCouponDiscount() + calculateShipping();
  };

  // Tạo mảng chứa thông tin đầy đủ của các sản phẩm đã chọn để chuyển sang checkout
  const getSelectedProductsData = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item._id))
      .map((item) => {
        const discountedPrice = item.price - item.price * (item.discount / 100);
        return {
          ...item,
          discountedPrice: discountedPrice, // Thêm giá đã giảm
          totalPrice: discountedPrice * item.quantity, // Thêm tổng giá cho sản phẩm
        };
      });
  };

  if (loading) {
    return <PageLoad zIndex={1} />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb items={[{ text: 'Cart' }]} />
      <div className="cart">
        <div className="cart__container">
          <div className="cart__items">
            <div className="cart__select-all">
              <input
                type="checkbox"
                checked={cartItems.length !== 0 && selectedItems.length === cartItems.length}
                onChange={handleSelectAll}
              />
              <span>Chọn tất cả</span>
            </div>
            {cartItems.length !== 0 ? (
              cartItems.map((item) => (
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
                        {(item.price - item.price * (item.discount / 100)).toLocaleString()}đ/{item.unit}
                      </span>
                      <span className="original-price">{item.price.toLocaleString()}đồng</span>{' '}
                      <span className="savings">
                        Tiết kiệm : {(item.price - (item.price - item.price * (item.discount / 100))).toLocaleString()}đ
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
                      {((item.price - item.price * (item.discount / 100)) * item.quantity).toLocaleString()}đ
                    </div>
                  </div>

                  <div className="cart__item-actions">
                    <button className="remove" onClick={() => handleRemoveItem(item._id)}>
                      Remove
                    </button>
                    <button onClick={() => handleProductClick(item)}>Xem chi tiết</button>
                  </div>
                </div>
              ))
            ) : (
              <img className="img__cart-empty" src={cartEmpty} alt="Cart Empty" />
            )}
          </div>

          <div className="cart__summary">
            <h2>Giỏ hàng chi tiết</h2>

            <div className="cart__coupon">
              <div className="coupon-label">Áp dụng mã giảm giá</div>
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Tìm kiếm mã giảm giá ở đây..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon}>Áp dụng</button>
              </div>
            </div>

            <div className="cart__totals">
              <div className="subtotal">
                <span>Thành tiền</span>
                <span>{calculateSubtotal().toLocaleString()} đồng</span>
              </div>
              <div className="coupon-discount">
                <span>Mã giảm giá</span>
                <span>{calculateCouponDiscount().toLocaleString()} đồng</span>
              </div>
              <div className="shipping">
                <span>Phí vận chuyển</span>
                <span>{calculateShipping().toLocaleString()} đồng</span>
              </div>
              <div className="total">
                <span>Tổng</span>
                <span className="total-amount">{calculateTotal().toLocaleString()} đồng</span>
              </div>
            </div>
            <Link
              to="/checkout"
              state={{
                selectedProducts: getSelectedProductsData(),
                summary: {
                  subtotal: calculateSubtotal(),
                  couponDiscount: calculateCouponDiscount(),
                  shipping: calculateShipping(),
                  total: calculateTotal(),
                },
              }}
            >
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
