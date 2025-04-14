import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Bell pepper',
      image: '/images/products/bell-pepper.jpg',
      price: 35.1,
      originalPrice: 45.68,
      quantity: 0,
      soldBy: 'Fresho',
      weight: '500 g',
    },
    {
      id: 2,
      name: 'Eggplant',
      image: '/images/products/eggplant.jpg',
      price: 52.95,
      originalPrice: 68.49,
      quantity: 0,
      soldBy: 'Nesto',
      weight: '250 g',
    },
    {
      id: 3,
      name: 'Onion',
      image: '/images/products/onion.jpg',
      price: 67.36,
      originalPrice: 96.58,
      quantity: 0,
      soldBy: 'Basket',
      weight: '750 g',
    },
  ]);

  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = (id, change) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item)),
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const shipping = 6.9;
  const couponDiscount = 0.0;

  const calculateTotal = () => {
    return calculateSubtotal() + shipping - couponDiscount;
  };

  const handleRemoveItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleSaveForLater = (id) => {
    // Implement save for later functionality
    console.log('Save for later:', id);
  };

  const handleApplyCoupon = () => {
    // Implement coupon application logic
    console.log('Applying coupon:', couponCode);
  };

  return (
    <div className="cart">
      <Breadcrumb items={[{ text: 'Cart' }]} />

      <div className="cart__container">
        <div className="cart__items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart__item">
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
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 0}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)} className="quantity-btn">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              <div className="cart__item-total">
                <div className="total-label">Total</div>
                <div className="total-value">${(item.price * item.quantity).toFixed(2)}</div>
              </div>

              <div className="cart__item-actions">
                <button className="save-for-later" onClick={() => handleSaveForLater(item.id)}>
                  Save for later
                </button>
                <button className="remove" onClick={() => handleRemoveItem(item.id)}>
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
              <button onClick={handleApplyCoupon}>Apply</button>
            </div>
          </div>

          <div className="cart__totals">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="coupon-discount">
              <span>Coupon Discount</span>
              <span>(-) ${couponDiscount.toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="total">
              <span>Total (USD)</span>
              <span className="total-amount">${calculateTotal().toFixed(2)}</span>
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
  );
};

export default Cart;
