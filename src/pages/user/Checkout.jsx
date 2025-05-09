import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faWallet, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';
import { useLocation, Link } from 'react-router-dom';

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const location = useLocation();

  // Lấy dữ liệu sản phẩm đã chọn và thông tin tóm tắt từ Cart
  const { selectedProducts = [], summary = {} } = location.state || {};

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

  // Sử dụng các giá trị từ summary hoặc tính toán lại nếu không có
  const subtotal =
    summary.subtotal || selectedProducts.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const shipping = summary.shipping || 30000;
  const couponDiscount = summary.couponDiscount || 0;
  const tax = Math.round(subtotal * 0.1); // giả sử thuế 10%
  const total = summary.total || subtotal + shipping + tax - couponDiscount;

  // Xử lý đặt hàng
  const handlePlaceOrder = () => {
    console.log('Placing order with:');
    console.log('- Products:', selectedProducts);
    console.log('- Address:', addresses[selectedAddress]);
    console.log('- Payment:', selectedPayment);
    console.log('- Total:', total);
    // Tại đây sẽ gọi API để tạo đơn hàng
    alert('Đặt hàng thành công!');
  };

  if (selectedProducts.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Không có sản phẩm nào được chọn để thanh toán</h2>
        <Link to="/cart" className="return-to-cart">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ text: 'Cart', link: '/cart' }, { text: 'Checkout' }]} />
      <div className="checkout">
        <div className="checkout__container">
          <div className="checkout__main">
            {/* Delivery Address Section */}
            <section className="checkout__section">
              <div className="section__header">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <h2>Địa chỉ giao hàng</h2>
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

            {/* Payment Option Section */}
            <section className="checkout__section">
              <div className="section__header">
                <FontAwesomeIcon icon={faWallet} />
                <h2>Phương thức thanh toán</h2>
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
            <h2>Tóm tắt đơn hàng</h2>
            <div className="order__items">
              {selectedProducts.map((item) => (
                <div key={item._id} className="order__item">
                  <img src={(item.images && item.images[0] && item.images[0].url) || ''} alt={item.name} />
                  <div className="item__details">
                    <span
                      className="item__name"
                      style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.8rem' }}
                    >
                      {item.name}
                    </span>
                    <div className="item__info">
                      <span className="item__quantity" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Số lượng: {item.quantity}
                      </span>
                      <span className="item__price" style={{ display: 'block', fontSize: '1.4rem' }}>
                        Đơn giá: {item.discountedPrice?.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <span className="item__total">{item.totalPrice?.toLocaleString()}đ</span>
                </div>
              ))}
            </div>

            <div className="order__totals">
              <div className="total__row">
                <span>Thành tiền</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              <div className="total__row">
                <span>Phí vận chuyển</span>
                <span>{shipping.toLocaleString()}đ</span>
              </div>
              {couponDiscount > 0 && (
                <div className="total__row coupon">
                  <span>Mã giảm giá</span>
                  <span className="discount">-{couponDiscount.toLocaleString()}đ</span>
                </div>
              )}
              <div className="total__row final">
                <span>Tổng thanh toán</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
            </div>

            <button className="place-order__btn" onClick={handlePlaceOrder}>
              Đặt hàng
            </button>

            <Link to="/cart" className="return-to-cart btn btn-cancel">
              <FontAwesomeIcon icon={faArrowLeft} /> Quay lại giỏ hàng
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Checkout;
