// ProductDetails/components/WriteReviewForm.jsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faStar } from '@fortawesome/free-solid-svg-icons';
import { addReview } from '../../../services/ReviewService';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const WriteReviewForm = ({ setShowReviewForm }) => {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newRating === 0 || newComment.trim() === '') {
      setError('Vui lòng chọn số sao và nhập nhận xét.');
      return;
    } else {
      setError('');
    }

    if (!user) {
      toast.error('Vui long đăng nhập để viết đánh giá!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        duration: 2000,
      });
      navigate('/login');
      return;
    }

    const review = {
      productId: id,
      rating: newRating,
      comment: newComment.trim(),
    };

    const res = await addReview(review, dispatch, accessToken, axiosJWT);

    if (res.success) {
      toast.success('Viết đánh giá thành công!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        duration: 2000,
      });
      setNewRating(0);
      setNewComment('');
      setError('');
      setShowReviewForm(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="rating-input">
        <label>Chọn số sao:</label>
        <div className="stars-select">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={star <= newRating ? faStarSolid : faStar}
              style={{
                color: star <= newRating ? '#f5a623' : '#ccc',
              }}
              onClick={() => setNewRating(star)}
              aria-label={`Đánh giá ${star} sao`}
            />
          ))}
        </div>
      </div>

      <div className="comment-input">
        <label htmlFor="review-comment">Nhận xét của bạn:</label>
        <textarea
          id="review-comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          placeholder="Nhập nhận xét của bạn..."
        ></textarea>
      </div>

      {error && (
        <p className="error-message" style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn btn__submit-review">
        Gửi đánh giá
      </button>
    </form>
  );
};

export default WriteReviewForm;
