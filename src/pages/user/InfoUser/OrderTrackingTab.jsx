import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getOrdersStatus, getOrdersByIdStatus } from '../../../services/orderService';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';

import cartEmpty from '@assets/icons/cart-empty.svg';

const OrderTrackingTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('status') || 'pending';

  const [orders, setOrders] = useState([]);

  const statusMap = {
    all: 'Tất cả',
    pending: 'Chờ xác nhận',
    paid: 'Đã thanh toán',
    processing: 'Đang chuẩn bị hàng',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
  };

  useEffect(() => {
    fetchOrdersStatus(activeTab);
  }, [activeTab]);

  const fetchOrdersStatus = async (status) => {
    if (!user) {
      return [];
    }
    try {
      let response;
      if (id) {
        console.log(id, status, accessToken, axiosJWT);
        response = await getOrdersByIdStatus(id, status, accessToken, axiosJWT);
        if (response.success) {
          setOrders(response.data);
        }
      } else {
        response = await getOrdersStatus(status, accessToken, axiosJWT);
        if (response.success) {
          setOrders(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching orders status:', error);
      return [];
    }
  };

  return (
    <>
      <div className="profile__tab profile__tab-order">
        <div className="profile__tab-header">
          <nav className="header__nav">
            {Object.entries(statusMap).map(([key, name]) => (
              <button
                key={key}
                className={`header__nav-item ${activeTab === key ? 'active' : ''}`}
                onClick={() => {
                  navigate(`${id ? '' : '/info-user'}?tab=orders&status=${key}`);
                }}
              >
                {name}
              </button>
            ))}
          </nav>
        </div>

        {orders.length > 0 ? (
          orders.map((item) => (
            <div key={item._id || item.id} className="order-tracking">
              <div className="order__info">
                <span className="info__date">Ngày đặt hàng: {item.createdAt.split('T')[0]}</span>
                {Object.entries(statusMap).map(
                  ([key, name]) =>
                    item.status === key && (
                      <span key={key} className="info__status">
                        {name}
                      </span>
                    ),
                )}
              </div>
              <div className="order__items">
                {item.orderItems.map((item) => (
                  <div key={item._id || item.id} className="order__item">
                    <div className="item__image">
                      <img
                        src={
                          (item._idProduct.images && item._idProduct.images[0] && item._idProduct.images[0].url) || ''
                        }
                        alt={item.name}
                      />
                    </div>
                    <div className="item__details">
                      <span className="item__name">{item.name}</span>
                      <div className="item__info">
                        <span className="item__quantity">Số lượng: {item.quantity}</span>
                        {/* <span className="item__price">Đơn giá: {item.price?.toLocaleString()}đ</span> */}
                      </div>
                    </div>
                    <span className="item__total">Đơn giá: {item.price?.toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              <div className="order__info">
                <span className="info__payment-method">
                  {item.paymentMethod === 'cod'
                    ? 'Thanh toán khi nhận hàng'
                    : item.isPaid === false
                      ? 'Chưa thanh toán'
                      : 'Đã thanh toán'}
                </span>
                <span className="info__total">Thành tiền: {item.totalAmount?.toLocaleString()}đ</span>
              </div>
            </div>
          ))
        ) : (
          <img className="img__empty" src={cartEmpty} alt="Cart Empty" />
        )}
      </div>
    </>
  );
};

export default memo(OrderTrackingTab);
