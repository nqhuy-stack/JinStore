// File: src/pages/admin/Orders.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import Pagination from '@components/ui/Pagination'; // Thêm import Pagination
import * as XLSX from 'xlsx';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderCode: '406-4883635',
      date: 'Jul 20, 2022',
      paymentMethod: 'Paypal',
      deliveryStatus: 'Success',
      amount: 15,
      items: [
        {
          productId: 1,
          name: 'Outerwear & Coats',
          quantity: 1,
          price: 63.54,
          image: 'https://via.placeholder.com/100',
        },
      ],
    },
    {
      id: 2,
      orderCode: '573-6858572',
      date: 'Jul 25, 2022',
      paymentMethod: 'Paypal',
      deliveryStatus: 'Success',
      amount: 15,
      items: [
        {
          productId: 2,
          name: 'Slim Fit Plastic Coat',
          quantity: 5,
          price: 63.54,
          image: 'https://via.placeholder.com/100',
        },
      ],
    },
    {
      id: 3,
      orderCode: '759-4568734',
      date: 'Jul 28, 2022',
      paymentMethod: 'Stripe',
      deliveryStatus: 'Pending',
      amount: 15,
      items: [
        { productId: 3, name: "Men's Sweatshirt", quantity: 1, price: 63.54, image: 'https://via.placeholder.com/100' },
      ],
    },
    {
      id: 4,
      orderCode: '546-7646537',
      date: 'Jul 30, 2022',
      paymentMethod: 'Paypal',
      deliveryStatus: 'Success',
      amount: 15,
      items: [{ productId: 4, name: 'Snack Pack', quantity: 1, price: 15.0, image: 'https://via.placeholder.com/100' }],
    },
    {
      id: 5,
      orderCode: '479-7533144',
      date: 'Aug 01, 2022',
      paymentMethod: 'Stripe',
      deliveryStatus: 'Success',
      amount: 15,
      items: [
        { productId: 5, name: 'Snack Pack 2', quantity: 1, price: 15.0, image: 'https://via.placeholder.com/100' },
      ],
    },
    {
      id: 6,
      orderCode: '456-1245789',
      date: 'Aug 10, 2022',
      paymentMethod: 'Stripe',
      deliveryStatus: 'Cancel',
      amount: 15,
      items: [{ productId: 6, name: 'Drink Pack', quantity: 1, price: 15.0, image: 'https://via.placeholder.com/100' }],
    },
    // Thêm nhiều đơn hàng hơn để minh họa phân trang (tổng cộng 50 đơn hàng)
    ...Array.from({ length: 44 }, (_, i) => ({
      id: i + 7,
      orderCode: `123-45678${i + 10}`,
      date: 'Aug 15, 2022',
      paymentMethod: Math.random() > 0.5 ? 'Paypal' : 'Stripe',
      deliveryStatus: Math.random() > 0.5 ? 'Success' : 'Pending',
      amount: 15,
      items: [
        {
          productId: i + 7,
          name: `Product ${i + 7}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 50) + 10,
          image: 'https://via.placeholder.com/100',
        },
      ],
    })),
  ]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const itemsPerPage = 10; // Số đơn hàng trên mỗi trang
  const navigate = useNavigate();

  const handleViewOrder = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  const handleEditOrder = (id) => {
    navigate(`/admin/orders/edit/${id}`);
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setOrders(orders.filter((o) => o.id !== orderToDelete.id));
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      setLoading(false);
    }, 500);
  };

  const handleDownloadAllOrders = () => {
    try {
      setLoading(true);

      // Format data for Excel with more details
      const excelData = orders.map((order) => ({
        'Order Code': order.orderCode,
        Date: order.date,
        'Payment Method': order.paymentMethod,
        'Delivery Status': order.deliveryStatus,
        'Total Amount': `$${order.amount.toFixed(2)}`,
        'Items Count': order.items.length,
        Items: order.items.map((item) => `${item.name} (${item.quantity}x) - $${item.price.toFixed(2)}`).join('\n'),
        'Customer Info': 'N/A', // Placeholder for future customer data
        'Shipping Address': 'N/A', // Placeholder for future shipping data
        Notes: '', // Placeholder for order notes
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Create main orders worksheet
      const wsOrders = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Order Code
        { wch: 12 }, // Date
        { wch: 15 }, // Payment Method
        { wch: 15 }, // Delivery Status
        { wch: 12 }, // Total Amount
        { wch: 10 }, // Items Count
        { wch: 50 }, // Items
        { wch: 20 }, // Customer Info
        { wch: 30 }, // Shipping Address
        { wch: 20 }, // Notes
      ];
      wsOrders['!cols'] = colWidths;

      // Create summary worksheet
      const summaryData = [
        {
          'Total Orders': orders.length,
          'Total Revenue': `$${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}`,
          'Success Orders': orders.filter((order) => order.deliveryStatus === 'Success').length,
          'Pending Orders': orders.filter((order) => order.deliveryStatus === 'Pending').length,
          'Canceled Orders': orders.filter((order) => order.deliveryStatus === 'Cancel').length,
          'PayPal Orders': orders.filter((order) => order.paymentMethod === 'Paypal').length,
          'Stripe Orders': orders.filter((order) => order.paymentMethod === 'Stripe').length,
        },
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);

      // Set summary column widths
      wsSummary['!cols'] = [
        { wch: 15 }, // Total Orders
        { wch: 15 }, // Total Revenue
        { wch: 15 }, // Success Orders
        { wch: 15 }, // Pending Orders
        { wch: 15 }, // Canceled Orders
        { wch: 15 }, // PayPal Orders
        { wch: 15 }, // Stripe Orders
      ];

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(wb, wsOrders, 'Orders');
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // Add metadata
      wb.Props = {
        Title: 'Orders Report',
        Subject: 'Orders Export',
        Author: 'Admin',
        CreatedDate: new Date(),
        Company: 'JinStore',
      };

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(data);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      link.download = `orders_report_${date}_${time}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      alert('Orders report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading orders:', error);
      alert('Error downloading orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTracking = (orderCode) => {
    alert(`Tracking order: ${orderCode}`);
  };

  const filteredOrders = orders.filter((order) => order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()));

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">Order List</h2>
        <button className="admin__download-button" onClick={handleDownloadAllOrders}>
          Download All Orders
        </button>
      </div>
      <div className="admin__search-bar">
        <input
          type="text"
          placeholder="Search by Order Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className="admin__table-wrapper">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Order Image</th>
                  <th>Order Code</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Delivery Status</th>
                  <th>Amount</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <img
                        src={order.items[0]?.image}
                        alt={order.items[0]?.name}
                        className="admin__image-preview admin__image-preview--order"
                      />
                    </td>
                    <td>{order.orderCode}</td>
                    <td>{order.date}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span className={`admin__status admin__status--${order.deliveryStatus.toLowerCase()}`}>
                        {order.deliveryStatus}
                      </span>
                    </td>
                    <td>${order.amount.toFixed(2)}</td>
                    <td>
                      <button
                        className="admin__action-btn admin__action-btn--view"
                        onClick={() => handleViewOrder(order.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--edit"
                        onClick={() => handleEditOrder(order.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--delete"
                        onClick={() => handleDeleteOrder(order)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--tracking"
                        onClick={() => handleTracking(order.orderCode)}
                        disabled={loading}
                      >
                        Tracking
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={confirmDeleteOrder}
        title="Confirm Delete Order"
        message={orderToDelete ? `Are you sure you want to delete order "${orderToDelete.orderCode}"?` : ''}
      />
    </section>
  );
};

export default Orders;
