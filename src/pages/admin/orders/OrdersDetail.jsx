// File: src/pages/admin/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import { getOrderDetails } from '../../../services/orderService';

const STATUS_MAP = {
  pending: 'Chờ xác nhận',
  paid: 'Đã thanh toán',
  processing: 'Đang chuẩn bị hàng',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  received: 'Đã nhận hàng',
  cancelled: 'Đã hủy',
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);

  // State management
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance
  const axiosJWT = user ? createAxios(user, dispatch, loginSuccess) : null;

  // Fetch order data
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!user?.accessToken || !id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await getOrderDetails(id, user.accessToken, axiosJWT);

        if (response.success) {
          setOrder(response.data);
        } else {
          setError('Không thể tải thông tin đơn hàng');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message || 'Lỗi khi tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, []);

  // Event handlers
  const handleBack = () => {
    navigate('/admin/orders');
  };

  const handleEditOrder = () => {
    navigate(`/admin/orders/edit/${id}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      paid: '#28a745',
      processing: '#17a2b8',
      shipping: '#6f42c1',
      delivered: '#28a745',
      received: '#28a745',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  // Loading state
  if (loading) {
    return (
      <section className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">Chi tiết đơn hàng</h2>
        </div>
        <div className="admin__loading">
          <div className="loading-spinner"></div>
          <p>Đang tải chi tiết đơn hàng...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">Chi tiết đơn hàng</h2>
          <button className="admin-add__button" onClick={handleBack}>
            Quay lại danh sách
          </button>
        </div>
        <div className="admin__error">
          <p>Lỗi: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </section>
    );
  }

  // No order found
  if (!order) {
    return (
      <section className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">Chi tiết đơn hàng</h2>
          <button className="admin-add__button" onClick={handleBack}>
            Quay lại danh sách
          </button>
        </div>
        <div className="admin__not-found">
          <p>Không tìm thấy đơn hàng với ID: {id}</p>
        </div>
      </section>
    );
  }

  // Calculate totals
  const subtotal =
    order.orderItems?.reduce((sum, item) => {
      const itemPrice = item.price * (1 - (item.discount || 0) / 100);
      return sum + item.quantity * itemPrice;
    }, 0) || 0;

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Chi tiết đơn hàng #{order._id?.slice(-6).toUpperCase()}</h2>
        <div className="admin-section__actions">
          <button className="admin-add__button" onClick={handleBack}>
            Quay lại danh sách
          </button>
        </div>
      </div>

      <div className="admin__order-details">
        {/* Order Information */}
        <div className="admin__order-info-grid">
          <div className="admin__info-card">
            <h3>Thông tin khách hàng</h3>
            <div className="admin__info-group">
              <label>Tên khách hàng:</label>
              <span>{order._idUser?.fullname || 'N/A'}</span>
            </div>
            <div className="admin__info-group">
              <label>Email:</label>
              <span>{order._idUser?.email || 'N/A'}</span>
            </div>
            <div className="admin__info-group">
              <label>Số điện thoại:</label>
              <span>{order._idUser?.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="admin__info-card">
            <h3>Thông tin đơn hàng</h3>
            <div className="admin__info-group">
              <label>Ngày tạo:</label>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="admin__info-group">
              <label>Trạng thái:</label>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                {STATUS_MAP[order.status] || order.status}
              </span>
            </div>
            <div className="admin__info-group">
              <label>Thanh toán:</label>
              <span className={`payment-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
            <div className="admin__info-group">
              <label>Phương thức thanh toán:</label>
              <span>{order.paymentMethod?.toUpperCase()}</span>
            </div>
            {order.paidAt && (
              <div className="admin__info-group">
                <label>Ngày thanh toán:</label>
                <span>{formatDate(order.paidAt)}</span>
              </div>
            )}
          </div>

          <div className="admin__info-card">
            <h3>Địa chỉ giao hàng</h3>
            {order.shippingAddress ? (
              <>
                <div className="admin__info-group">
                  <label>Người nhận:</label>
                  <span>{order.shippingAddress.fullName}</span>
                </div>
                <div className="admin__info-group">
                  <label>Số điện thoại:</label>
                  <span>{order.shippingAddress.phone}</span>
                </div>
                <div className="admin__info-group">
                  <label>Địa chỉ:</label>
                  <span>
                    {order.shippingAddress.address}, {order.shippingAddress.ward},{order.shippingAddress.district},{' '}
                    {order.shippingAddress.city}
                  </span>
                </div>
              </>
            ) : (
              <p>Chưa có thông tin địa chỉ</p>
            )}
          </div>
        </div>

        {/* Order Note */}
        {order.note && (
          <div className="admin__order-note">
            <h3>Ghi chú đơn hàng</h3>
            <p>{order.note}</p>
          </div>
        )}

        {/* Order Items */}
        <div className="admin__order-items">
          <h3 className="admin__section-subtitle">Sản phẩm trong đơn hàng</h3>
          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="admin__table-wrapper">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Giảm giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => {
                    const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
                    const itemTotal = item.quantity * discountedPrice;

                    return (
                      <tr key={index}>
                        <td>
                          <img
                            src={item._idProduct?.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'}
                            alt={item.name}
                            className="admin__image-preview admin__image-preview--order"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                            }}
                          />
                        </td>
                        <td>
                          <div>
                            <strong>{item.name}</strong>
                            <br />
                            <small>SKU: {item._idProduct?._id?.slice(-6).toUpperCase()}</small>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.discount ? <span className="discount-badge">-{item.discount}%</span> : 'Không'}</td>
                        <td>{formatCurrency(itemTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Không có sản phẩm trong đơn hàng này.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="admin__order-summary">
          <div className="admin__order-summary-item">
            <span>Tạm tính:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="admin__order-summary-item">
            <span>Phí vận chuyển:</span>
            <span>{formatCurrency(order.shippingFee || 0)}</span>
          </div>
          <div className="admin__order-summary-item admin__order-summary-item--total">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
