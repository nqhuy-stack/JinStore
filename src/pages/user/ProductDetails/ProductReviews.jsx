import { faStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';

import WriteReviewForm from '@components/common/forms/FormReview';

// ProductDetails/components/ProductReviews.jsx
const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock data phù hợp với model Review
  const mockReviews = [
    {
      _id: '673abc123def456789012345',
      _idUser: {
        _id: '673abc123def456789012346',
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
      },
      _idProduct: product._id,
      rating: 5,
      comment: 'Sản phẩm tuyệt vời! Chất lượng rất tốt và giao hàng nhanh. Tôi rất hài lòng với việc mua hàng này.',
      isDeleted: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      _id: '673abc123def456789012347',
      _idUser: {
        _id: '673abc123def456789012348',
        name: 'Trần Thị Bình',
        email: 'tranthibinh@email.com',
      },
      _idProduct: product._id,
      rating: 4,
      comment: 'Sản phẩm khá tốt, đáng tiền. Có một vài điểm nhỏ cần cải thiện nhưng nhìn chung rất hài lòng.',
      isDeleted: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      _id: '673abc123def456789012349',
      _idUser: {
        _id: '673abc123def456789012350',
        name: 'Lê Minh Cường',
        email: 'leminhcuong@email.com',
      },
      _idProduct: product._id,
      rating: 5,
      comment: 'Chất lượng vượt ngoài mong đợi. Sẽ giới thiệu cho bạn bè và mua lại trong tương lai.',
      isDeleted: false,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
  ];

  // Giả lập việc fetch reviews từ API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Trong thực tế sẽ gọi API:
        // const response = await fetch(`/api/reviews/product/${product._id}`);
        // const data = await response.json();

        // Giả lập delay API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Filter reviews không bị xóa
        const activeReviews = mockReviews.filter((review) => !review.isDeleted);

        // Tính toán rating trung bình
        const totalRating = activeReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = activeReviews.length > 0 ? totalRating / activeReviews.length : 0;

        setReviews(activeReviews);
        setAverageRating(avgRating);
        setTotalReviews(activeReviews.length);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (product._id) {
      fetchReviews();
    }
  }, [product._id]);

  // Hàm render sao với hỗ trợ nửa sao
  const renderStars = (rating, starSize = '2rem') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Sao đầy
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={`full-${i}`} icon={faStarSolid} className="filled" style={{ fontSize: starSize }} />,
      );
    }

    // Nửa sao
    if (hasHalfStar && fullStars < 5) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="filled" style={{ fontSize: starSize }} />);
    }

    // Sao rỗng
    const totalFilledStars = fullStars + (hasHalfStar ? 1 : 0);
    const emptyStars = 5 - totalFilledStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="empty" style={{ fontSize: starSize }} />);
    }

    return stars;
  };

  // Hàm format thời gian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Hàm tính thời gian relative
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  };

  if (loading) {
    return (
      <div className="reviews-content">
        <div className="loading">Đang tải đánh giá...</div>
      </div>
    );
  }

  return (
    <div className="reviews-content">
      <div className="reviews-summary">
        <div className="rating-overview">
          <h3>Đánh giá khách hàng</h3>
          <div className="average-rating">
            <span className="rating-number">{totalReviews > 0 ? averageRating.toFixed(1) : '0.0'}</span>
            <div className="stars">{renderStars(averageRating)}</div>
            <span className="total-reviews">Dựa trên {totalReviews.toLocaleString()} đánh giá</span>
          </div>
        </div>

        <div className="write-review">
          <button className="write-review-button" onClick={() => setShowReviewForm(!showReviewForm)}>
            <FontAwesomeIcon icon={faStar} />
            {showReviewForm ? 'Đóng' : 'Viết đánh giá'}
          </button>
        </div>
      </div>
      {showReviewForm && <WriteReviewForm product={product} setShowReviewForm={setShowReviewForm} />}
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <h4>{review._idUser.name}</h4>
                  <span className="review-date">
                    {getRelativeTime(review.createdAt)} - {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="review-rating">{renderStars(review.rating, '1.6rem')}</div>
              </div>
              {review.comment && <p className="review-text">{review.comment}</p>}
              {review.updatedAt !== review.createdAt && (
                <span className="review-edited">(Đã chỉnh sửa vào {formatDate(review.updatedAt)})</span>
              )}
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            <p>Hãy là người đầu tiên đánh giá!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
