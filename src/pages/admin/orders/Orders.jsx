// File: src/pages/admin/Orders.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '@components/common/ui/Modal';
import Pagination from '@components/common/ui/Pagination';
import HeaderStatusOrder from '../../../components/common/ui/HeaderStatusOrder';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import { getAllOrders } from '../../../services/orderService';

const STATUS_MAP = {
  all: 'Tất cả',
  pending: 'Chờ xác nhận',
  paid: 'Đã thanh toán',
  processing: 'Đang chuẩn bị hàng',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
};

const STATUS_ENTRIES = Object.entries(STATUS_MAP);

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [searchParams] = useSearchParams();

  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const activeTab = searchParams.get('status') || 'pending';

  // Axios instance
  const axiosJWT = user ? createAxios(user, dispatch, loginSuccess) : null;

  // Navigation handlers
  const handleViewOrder = (id) => navigate(`/admin/orders/${id}`);
  const handleEditOrder = (id) => navigate(`/admin/orders/edit/${id}`);
  const handleTracking = (orderCode) => navigate(`/tracking/${orderCode}`);

  // Delete order handlers
  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOrder = () => {
    setLoading(true);
    // Simulate delete API call
    setTimeout(() => {
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      setLoading(false);
    }, 500);
  };

  // Tab navigation
  const handleTabClick = (status) => {
    navigate(`/admin/orders?status=${status}`);
    setCurrentPage(1);
  };

  // Fetch orders
  const fetchOrders = async (status) => {
    if (!user?.accessToken) return;

    setLoading(true);
    try {
      const response = await getAllOrders(status, user.accessToken, axiosJWT);
      setOrders(response.success ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab, user]);

  // Filter orders by search term
  const filteredOrders = orders.filter(
    (order) =>
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._idUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._idUser?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems?.some((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Quản lý đơn hàng</h2>
      </div>

      <div className="admin-section__search">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, khách hàng, sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-orders__tabs">
        <HeaderStatusOrder activeTab={activeTab} handleTabClick={handleTabClick} STATUS_ENTRIES={STATUS_ENTRIES} />
      </div>

      <div className="admin-section__content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="block__table ">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày tạo</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <div>
                            {order._idUser?.fullname || 'N/A'} ||{' '}
                            {order._idUser?.phone && <small>{order._idUser.phone}</small>}
                          </div>
                        </td>
                        <td>{order.orderItems?.length || 0} sản phẩm</td>
                        <td>
                          <div className={`payment-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                            {order.isPaid ? 'Đã TT' : 'Chưa TT'}
                          </div>
                        </td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                            {STATUS_MAP[order.status]}
                          </span>
                        </td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => handleViewOrder(order._id)} title="Xem">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button onClick={() => handleEditOrder(order._id)} title="Sửa">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => handleDeleteOrder(order)} title="Xóa">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-data">
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="admin-orders__pagination">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={confirmDeleteOrder}
        title="Xác nhận xóa đơn hàng"
        message={orderToDelete ? `Bạn có chắc chắn muốn xóa đơn hàng "${orderToDelete._id}"?` : ''}
      />
    </div>
  );
};

export default Orders;
