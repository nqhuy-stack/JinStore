// File: src/pages/admin/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dữ liệu giả lập (đồng bộ với Orders.jsx)
  const initialOrders = [
    {
      id: 1,
      customerName: 'John Doe',
      date: 'Jul 20, 2022',
      status: 'Success',
      shipping: 12.0,
      tax: 10.0,
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
      customerName: 'Jane Smith',
      date: 'Jul 25, 2022',
      status: 'Success',
      shipping: 12.0,
      tax: 10.0,
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
      customerName: 'Alice Johnson',
      date: 'Jul 28, 2022',
      status: 'Pending',
      shipping: 12.0,
      tax: 10.0,
      items: [
        {
          productId: 3,
          name: "Men's Sweatshirt",
          quantity: 1,
          price: 63.54,
          image: 'https://via.placeholder.com/100',
        },
      ],
    },
    {
      id: 4,
      customerName: 'Bob Brown',
      date: 'Jul 30, 2022',
      status: 'Success',
      shipping: 12.0,
      tax: 10.0,
      items: [
        {
          productId: 4,
          name: 'Snack Pack',
          quantity: 1,
          price: 15.0,
          image: 'https://via.placeholder.com/100',
        },
      ],
    },
    {
      id: 5,
      customerName: 'Charlie Davis',
      date: 'Aug 01, 2022',
      status: 'Success',
      shipping: 12.0,
      tax: 10.0,
      items: [
        {
          productId: 5,
          name: 'Snack Pack 2',
          quantity: 1,
          price: 15.0,
          image: 'https://via.placeholder.com/100',
        },
      ],
    },
    {
      id: 6,
      customerName: 'Diana Evans',
      date: 'Aug 10, 2022',
      status: 'Cancel',
      shipping: 12.0,
      tax: 10.0,
      items: [
        {
          productId: 6,
          name: 'Drink Pack',
          quantity: 1,
          price: 15.0,
          image: 'https://via.placeholder.com/100',
        },
      ],
    },
    // Thêm dữ liệu giả lập cho các đơn hàng khác (đồng bộ với Orders.jsx)
    ...Array.from({ length: 44 }, (_, i) => ({
      id: i + 7,
      customerName: `Customer ${i + 7}`,
      date: 'Aug 15, 2022',
      status: Math.random() > 0.5 ? 'Success' : 'Pending',
      shipping: 12.0,
      tax: 10.0,
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
  ];

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const foundOrder = initialOrders.find((o) => o.id === parseInt(id));
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError('Order not found');
    }
    setLoading(false);
  }, [id]);

  const handleBack = () => {
    navigate('/admin/orders');
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return null;

  // Tính toán Subtotal và Total
  const subtotal = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const total = subtotal + order.shipping + order.tax;

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">Order Detail (ID: {id})</h2>
        <button className="admin__add-button" onClick={handleBack}>
          Back to Orders
        </button>
      </div>
      <div className="admin__order-details">
        <div className="admin__order-info">
          <p>
            <strong>Customer Name:</strong> {order.customerName}
          </p>
          <p>
            <strong>Date:</strong> {order.date}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>
        <h3 className="admin__section-subtitle">Items</h3>
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="admin__image-preview admin__image-preview--order"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin__order-summary">
          <div className="admin__order-summary-item">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="admin__order-summary-item">
            <span>Shipping:</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="admin__order-summary-item">
            <span>Tax (GST):</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="admin__order-summary-item admin__order-summary-item--total">
            <span>Total Price:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
