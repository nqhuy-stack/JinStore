// File: src/pages/admin/ProductReviews.jsx
import { useState } from 'react';
import Pagination from '@components/ui/Pagination'; // Thêm import

const ProductReviews = () => {
  const [reviews, setReviews] = useState([
    // Dữ liệu giả lập (tăng số lượng để minh họa phân trang)
    {
      id: 1,
      customerName: 'Maureen Biologist',
      productName: 'Outwear & Coats',
      rating: 5,
      comment: 'The Product is NO Longer Needed',
      published: true,
    },
    {
      id: 2,
      customerName: 'Caroline Harris',
      productName: 'Slim Fit Plastic Coat',
      rating: 4,
      comment: 'The Product is NO Longer Needed',
      published: true,
    },
    // ... Thêm nhiều đánh giá hơn (giả lập 50 đánh giá)
    ...Array.from({ length: 48 }, (_, i) => ({
      id: i + 3,
      customerName: `Customer ${i + 3}`,
      productName: `Product ${i + 3}`,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: 'The Product is NO Longer Needed',
      published: Math.random() > 0.5,
    })),
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const itemsPerPage = 10; // Số mục trên mỗi trang

  const handleTogglePublish = (id) => {
    setLoading(true);
    setTimeout(() => {
      setReviews(reviews.map((review) => (review.id === id ? { ...review, published: !review.published } : review)));
      setLoading(false);
    }, 500);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">Product Reviews</h2>
      </div>
      <div className="admin__search-bar">
        <input
          type="text"
          placeholder="Search by Customer or Product Name..."
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
                  <th>No.</th>
                  <th>Customer Name</th>
                  <th>Product Name</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review, index) => (
                  <tr key={review.id}>
                    <td>{String(startIndex + index + 1).padStart(2, '0')}</td>
                    <td>{review.customerName}</td>
                    <td>{review.productName}</td>
                    <td>
                      <div className="admin__rating">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star ${i < review.rating ? 'admin__rating--filled' : ''}`}></i>
                        ))}
                      </div>
                    </td>
                    <td>{review.comment}</td>
                    <td>
                      <button
                        className={`admin__publish-btn ${
                          review.published ? 'admin__publish-btn--published' : 'admin__publish-btn--unpublished'
                        }`}
                        onClick={() => handleTogglePublish(review.id)}
                        disabled={loading}
                      >
                        <i className={`fas ${review.published ? 'fa-check' : 'fa-times'}`}></i>
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
    </section>
  );
};

export default ProductReviews;
