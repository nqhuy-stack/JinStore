import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTruck, faWallet, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('cod');

  const addresses = {
    home: {
      name: 'Jack Jennas',
      address: '8424 James Lane South San Francisco, CA 94080',
      pinCode: '+380',
      phone: '+ 380 (0564) 53-29-68',
      type: 'Home',
    },
    office: {
      name: 'Jack Jennas',
      address: 'Nakhimovskiy R-N / Lastovaya Ul., bld. 5/A, appt. 12',
      pinCode: '+380',
      phone: '+ 380 (0564) 53-29-68',
      type: 'Office',
    },
  };

  const orderItems = [
    { id: 1, name: 'Bell pepper', quantity: 1, price: 32.34, image: '/images/products/bell-pepper.jpg' },
    { id: 2, name: 'Eggplant', quantity: 3, price: 12.23, image: '/images/products/eggplant.jpg' },
    { id: 3, name: 'Onion', quantity: 2, price: 18.27, image: '/images/products/onion.jpg' },
    { id: 4, name: 'Potato', quantity: 1, price: 26.9, image: '/images/products/potato.jpg' },
    { id: 5, name: 'Baby Chili', quantity: 1, price: 19.28, image: '/images/products/baby-chili.jpg' },
    { id: 6, name: 'Broccoli', quantity: 2, price: 29.69, image: '/images/products/broccoli.jpg' },
  ];

  const subtotal = 111.81;
  const shipping = 8.9;
  const tax = 29.498;
  const couponDiscount = 23.1;
  const total = 19.28;

  const availableOffers = [
    'Combo: BB Royal Almond/Badam Californian, Extra Bold 100 gm...',
    'combo: Royal Cashew Californian, Extra Bold 100 gm + BB Royal Honey 500 gm',
  ];

  return (
    <div className="checkout">
      <Breadcrumb items={[{ text: 'Cart' }, { text: 'Checkout' }]} />

      <div className="checkout__container">
        <div className="checkout__main">
          {/* Delivery Address Section */}
          <section className="checkout__section">
            <div className="section__header">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <h2>Delivery Address</h2>
            </div>
            <div className="address__options">
              {Object.entries(addresses).map(([key, address]) => (
                <label key={key} className="address__option">
                  <input
                    type="radio"
                    name="address"
                    value={key}
                    checked={selectedAddress === key}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  />
                  <div className="address__card">
                    <div className="address__type">{address.type}</div>
                    <h3>{address.name}</h3>
                    <p>{address.address}</p>
                    <p>Pin Code: {address.pinCode}</p>
                    <p>Phone: {address.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Delivery Option Section */}
          <section className="checkout__section">
            <div className="section__header">
              <FontAwesomeIcon icon={faTruck} />
              <h2>Delivery Option</h2>
            </div>
            <div className="delivery__options">
              <label className="delivery__option">
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={selectedDelivery === 'standard'}
                  onChange={(e) => setSelectedDelivery(e.target.value)}
                />
                <div className="option__content">
                  <span>Standard Delivery Option</span>
                </div>
              </label>
              <label className="delivery__option">
                <input
                  type="radio"
                  name="delivery"
                  value="future"
                  checked={selectedDelivery === 'future'}
                  onChange={(e) => setSelectedDelivery(e.target.value)}
                />
                <div className="option__content">
                  <span>Future Delivery Option</span>
                </div>
              </label>
            </div>
          </section>

          {/* Payment Option Section */}
          <section className="checkout__section">
            <div className="section__header">
              <FontAwesomeIcon icon={faWallet} />
              <h2>Payment Option</h2>
            </div>
            <div className="payment__options">
              <label className="payment__option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPayment === 'cod'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div className="option__content">
                  <span>Cash On Delivery</span>
                  <p className="payment__note">
                    Pay digitally with SMS Pay Link. Cash may not be accepted in COVID restricted areas.
                    <button className="know-more">Know more</button>
                  </p>
                </div>
              </label>
              <label className="payment__option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPayment === 'card'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div className="option__content">
                  <span>Credit or Debit Card</span>
                </div>
              </label>
              <label className="payment__option">
                <input
                  type="radio"
                  name="payment"
                  value="netbanking"
                  checked={selectedPayment === 'netbanking'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div className="option__content">
                  <span>Net Banking</span>
                </div>
              </label>
              <label className="payment__option">
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={selectedPayment === 'wallet'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div className="option__content">
                  <span>My Wallet</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Section */}
        <aside className="checkout__summary">
          <h2>Order Summary</h2>
          <div className="order__items">
            {orderItems.map((item) => (
              <div key={item.id} className="order__item">
                <img src={item.image} alt={item.name} />
                <div className="item__details">
                  <span className="item__name">{item.name}</span>
                  <span className="item__quantity">X {item.quantity}</span>
                </div>
                <span className="item__price">${item.price}</span>
              </div>
            ))}
          </div>

          <div className="order__totals">
            <div className="total__row">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="total__row">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <div className="total__row">
              <span>Tax</span>
              <span>${tax}</span>
            </div>
            <div className="total__row coupon">
              <span>Coupon/Code</span>
              <span className="discount">$-{couponDiscount}</span>
            </div>
            <div className="total__row final">
              <span>Total (USD)</span>
              <span>${total}</span>
            </div>
          </div>

          {availableOffers.length > 0 && (
            <div className="available__offers">
              <div className="offers__header">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Available Offers</span>
              </div>
              <ul className="offers__list">
                {availableOffers.map((offer, index) => (
                  <li key={index}>{offer}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="place-order__btn">Place Order</button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
