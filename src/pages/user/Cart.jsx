import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import NotFound from './NotFound';
import PageLoad from '../PageLoad';
import cartEmpty from '@assets/icons/cart-empty.svg';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import Breadcrumb from '@components/common/ui/Breadcrumb';
import { getCart, deleteItemInCart, updateItemInCart } from '@services/CartService';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login.currentUser);

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAllSelected = selectedItems.length === cartItems.length;

  const { accessToken, axiosJWT } = useMemo(() => {
    if (!user) return { accessToken: null, axiosJWT: null };

    return {
      accessToken: user.accessToken,
      axiosJWT: createAxios(user, dispatch, loginSuccess),
    };
  }, [user, dispatch]);

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCart(accessToken, axiosJWT);

      if (response.success && Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, axiosJWT]);

  useEffect(() => {
    const itemCount = sessionStorage.getItem('itemCount');
    if (parseInt(itemCount) > 0) {
      fetchCartItems();
    }
  }, [fetchCartItems]);

  const handleQuantityChange = useCallback(
    async (itemId, change, oldQuantity) => {
      try {
        const newQuantity = oldQuantity + change;
        if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1

        const formData = {
          productId: itemId,
          quantity: newQuantity,
        };

        const response = await updateItemInCart(formData, accessToken, axiosJWT);

        if (response?.success) {
          setCartItems((prevItems) =>
            prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
          );
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    [accessToken, axiosJWT],
  );

  const handleQuantityInput = useCallback(
    async (itemId, value) => {
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
    },
    [accessToken, axiosJWT],
  );

  const handleSelectItem = useCallback((itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  const unselectItem = useCallback((itemId) => {
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  }, []);

  const handleRemoveItem = useCallback(
    async (itemId) => {
      try {
        const res = await deleteItemInCart(itemId, accessToken, axiosJWT);
        if (res.success) {
          setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
          unselectItem(itemId);
        } else {
          console.error('Delete failed:', res.message);
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
    [accessToken, axiosJWT, unselectItem],
  );

  const handleProductClick = useCallback(
    (product) => {
      if (!product || !product._id) return;
      navigate(`/product/${product._id}`);
    },
    [navigate],
  );

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
    }
  }, [isAllSelected, cartItems]);

  const calculateSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item._id)) {
        return total + item.discountPrice * item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems, selectedItems]);

  const calculateCouponDiscount = useMemo(() => {
    return 0;
  }, []);

  const calculateTotal = useMemo(() => {
    return calculateSubtotal - calculateCouponDiscount;
  }, [calculateSubtotal, calculateCouponDiscount]);

  // Tạo mảng chứa thông tin đầy đủ của các sản phẩm đã chọn để chuyển sang checkout
  const getSelectedProductsData = useMemo(() => {
    return cartItems
      .filter((item) => selectedItems.includes(item._id))
      .map((item) => {
        return {
          ...item,
        };
      });
  }, [cartItems, selectedItems]);

  const handleApplyCoupon = useCallback(() => {}, []);

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
                        {item.discountPrice.toLocaleString()}đ/{item.unit}
                      </span>
                      <span className="original-price">{item.price.toLocaleString()}đồng</span>{' '}
                      <span className="savings">Tiết kiệm : {(item.price - item.discountPrice).toLocaleString()}đ</span>
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
                    <div className="total-value">{(item.discountPrice * item.quantity).toLocaleString()}đ</div>
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
              <img className="img__empty" src={cartEmpty} alt="Cart Empty" />
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
                <span>{calculateSubtotal.toLocaleString()} đồng</span>
              </div>
              <div className="coupon-discount">
                <span>Mã giảm giá</span>
                <span>{calculateCouponDiscount.toLocaleString()} đồng</span>
              </div>
              <div className="total">
                <span>Tổng</span>
                <span className="total-amount">{calculateTotal.toLocaleString()} đồng</span>
              </div>
            </div>
            <Link
              to="/checkout?source=cart"
              state={{
                selectedProducts: getSelectedProductsData,
                summary: {
                  shipping: 30000,
                  subtotal: calculateSubtotal,
                  couponDiscount: calculateCouponDiscount,
                  total: calculateTotal,
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
