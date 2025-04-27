// File: src/pages/admin/ProductReviews.jsx
import { useState, useEffect } from 'react';
import Pagination from '@components/common/Pagination';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:1000/api/reviews');
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (reviewId, currentStatus) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:1000/api/reviews/${reviewId}`, {
        status: currentStatus === 'approved' ? 'rejected' : 'approved',
      });
      await fetchReviews(); // Refresh the list
      toast.success('Review status updated successfully');
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:1000/api/reviews/${reviewId}`);
        await fetchReviews(); // Refresh the list
        toast.success('Review deleted successfully');
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewDetails = (review) => {
    // You can implement a modal or navigate to a details page
    console.log('View review details:', review);
    // For now, we'll just show an alert with the details
    alert(`
      Review Details:
      User: ${review.user?.name || 'Anonymous'}
      Product: ${review.product?.name || 'Unknown Product'}
      Rating: ${review.rating}/5
      Comment: ${review.comment}
      Status: ${review.status || 'pending'}
      Created At: ${new Date(review.createdAt).toLocaleString()}
    `);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <p>Loading...</p>
      ) : (
        <>
          <div className="admin__table-wrapper">
            <table className="admin__table block__table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Customer Name</th>
                  <th>Product Name</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  currentReviews.map((review, index) => (
                    <tr key={review._id}>
                      <td>{String(startIndex + index + 1).padStart(2, '0')}</td>
                      <td>{review.user?.name || 'Anonymous'}</td>
                      <td>{review.product?.name || 'Unknown Product'}</td>
                      <td>
                        <div className="admin__rating">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < review.rating ? 'admin__rating--filled' : ''}`}
                            ></i>
                          ))}
                        </div>
                      </td>
                      <td>{review.comment}</td>
                      <td>
                        <span className={`admin__status-badge admin__status-badge--${review.status || 'pending'}`}>
                          {review.status || 'pending'}
                        </span>
                      </td>
                      <td>
                        <div className="admin__actions">
                          <button
                            className="admin__action-btn admin__action-btn--view"
                            onClick={() => handleViewDetails(review)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--product"
                            onClick={() => window.open(`/JinStore/product/${review.product?._id}`, '_blank')}
                            title="View Product"
                            disabled={!review.product?._id}
                          >
                            <i className="fas fa-shopping-bag"></i>
                          </button>
                          <button
                            className={`admin__publish-btn ${
                              review.status === 'approved'
                                ? 'admin__publish-btn--published'
                                : 'admin__publish-btn--unpublished'
                            }`}
                            onClick={() => handleTogglePublish(review._id, review.status)}
                            disabled={loading}
                            title={review.status === 'approved' ? 'Reject Review' : 'Approve Review'}
                          >
                            <i className={`fas ${review.status === 'approved' ? 'fa-check' : 'fa-times'}`}></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--delete"
                            onClick={() => handleDeleteReview(review._id)}
                            title="Delete Review"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {currentReviews.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </section>
  );
};

export default ProductReviews;
