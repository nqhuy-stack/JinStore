import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/common/ui/Modal';
import { addDiscount } from '@services/DiscountService';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import PageLoad from '@pages/pageLoad';
import toast from 'react-hot-toast';
import moment from 'moment/moment';

const AddDiscount = () => {
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    discount: '',
    activation: '',
    expiration: '',
    quantityLimit: '',
    isActive: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Thêm state để theo dõi các trường đã được nhập
  const [touchedFields, setTouchedFields] = useState({
    code: false,
    discount: false,
    activation: false,
    expiration: false,
    quantityLimit: false,
    isActive: true,
  });

  //NOTE: Hàm xử lý sự kiện khi nhấn nút "Thêm sản phẩm"
  const handleAddDiscount = (e) => {
    e.preventDefault();

    setLoading(true);
    setTimeout(() => {
      setIsAddModalOpen(true);
      setLoading(false);
    }, 500);
  };

  //NOTE: Hàm xác nhận thêm sản phẩm
  const confirmAddDiscount = async () => {
    try {
      setLoading(true);

      // Tạo đối tượng dữ liệu thay vì FormData vì backend đang mong đợi JSON
      const formData = {
        code: newDiscount.code.trim(),
        discount: Number(newDiscount.discount),
        activation: new Date(newDiscount.activation).toISOString(),
        expiration: new Date(newDiscount.expiration).toISOString(),
        quantityLimit: Number(newDiscount.quantityLimit),
        isActive: Boolean(newDiscount.isActive),
      };

      // Gọi API
      await addDiscount(formData, dispatch, accessToken, axiosJWT);

      // Reset form và chuyển hướng
      setNewDiscount({
        code: '',
        discount: '',
        activation: '',
        expiration: '',
        quantityLimit: '',
        isActive: true,
      });
      setIsAddModalOpen(false);
      navigate('/admin/discounts');
    } catch (error) {
      console.error('Error adding discount:', error);
      setError(error.response?.data?.message || 'Không thể thêm sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi người dùng rời khỏi trường nhập liệu
  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

    // Hiển thị thông báo nếu trường bắt buộc chưa được nhập
    if (!newDiscount[field]) {
      toast.error(`Vui lòng nhập ${getFieldLabel(field)}`, {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '1.6rem',
        },
        icon: '⚠️',
      });
    }
  };

  // Hàm lấy nhãn cho trường
  const getFieldLabel = (field) => {
    switch (field) {
      case 'code':
        return 'tên mã giảm giá';
      case 'discount':
        return 'giảm giá';
      case 'activation ':
        return 'Ngày kích hoạt';
      case 'expiration':
        return 'Ngày đến hạn';
      case 'isActive':
        return 'trạng thái';
      case 'quantityLimit':
        return 'số lượng tối đa';
      default:
        return field;
    }
  };

  return (
    <section className="admin-section">
      {loading ? (
        <PageLoad zIndex="1" />
      ) : (
        <>
          <div className="admin-section__header">
            <h2 className="admin-section__title">Thêm mã giảm giá</h2>
          </div>
          <form className="admin__form" id="form-addDiscount" onSubmit={handleAddDiscount}>
            <div className="admin__form-row">
              <div className="admin__form-field">
                <label htmlFor="discount-code">
                  Mã giảm giá <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="discount-code"
                  value={newDiscount.code}
                  onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                  onBlur={() => handleBlur('code')}
                  required
                  placeholder="Nhập tên mã giảm giá"
                />
                {touchedFields.code && !newDiscount.code && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập mã giảm giá
                  </div>
                )}
              </div>
            </div>
            <div className="admin__form-row">
              <div className="admin__form-field">
                <label htmlFor="discount-discount">
                  Giảm giá(%) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="discount-discount"
                  value={newDiscount.discount}
                  onChange={(e) => setNewDiscount({ ...newDiscount, discount: e.target.value })}
                  step="1"
                  min={0}
                  max={100}
                  onBlur={() => handleBlur('discount')}
                  placeholder="Nhập % giảm giá"
                />
                {touchedFields.discount && !newDiscount.discount && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập % giảm giá
                  </div>
                )}
              </div>

              <div className="admin__form-field">
                <label htmlFor="discount-activation">
                  Ngày kích hoạt <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="discount-activation"
                  value={newDiscount.activation}
                  onChange={(e) => setNewDiscount({ ...newDiscount, activation: e.target.value })}
                  onBlur={() => handleBlur('activation')}
                  required
                  min={moment().format('YYYY-MM-DD')}
                  placeholder="Nhập ngày kích hoạt"
                />
                {touchedFields.activation && !newDiscount.activation && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập ngày kích hoạt
                  </div>
                )}
              </div>

              <div className="admin__form-field">
                <label htmlFor="discount-expiration">
                  Ngày hết hạn <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="discount-expiration"
                  value={newDiscount.expiration}
                  onChange={(e) => setNewDiscount({ ...newDiscount, expiration: e.target.value })}
                  onBlur={() => handleBlur('expiration')}
                  required
                  min={moment().format('YYYY-MM-DD')}
                  placeholder="Nhập ngày hết hạn"
                />
                {touchedFields.expiration && !newDiscount.expiration && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập ngày hết hạn
                  </div>
                )}
                {/* Kiểm tra logic ngày hết hạn phải sau ngày kích hoạt */}
                {newDiscount.activation &&
                  newDiscount.expiration &&
                  newDiscount.expiration <= newDiscount.activation && (
                    <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                      Ngày hết hạn phải sau ngày kích hoạt
                    </div>
                  )}
              </div>

              <div className="admin__form-field">
                <label htmlFor="discount-quantity">
                  Số lượng <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="discount-quantityLimit"
                  value={newDiscount.quantityLimit}
                  onChange={(e) => setNewDiscount({ ...newDiscount, quantityLimit: e.target.value })}
                  onBlur={() => handleBlur('quantityLimit')}
                  required
                  min="0"
                  placeholder="Nhập số lượng mã giảm giá giới hạn"
                />
                {touchedFields.quantityLimit && !newDiscount.quantityLimit && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập số lượng mã giảm giá giới hạn
                  </div>
                )}
              </div>
            </div>
            <div className="admin__form-row">
              <div className="admin__form-field checkbox">
                <input
                  id="discount-isActive"
                  type="checkbox"
                  checked={newDiscount.isActive}
                  onChange={(e) => setNewDiscount({ ...newDiscount, isActive: e.target.checked })}
                />
                <label htmlFor="discount-isActive" className="checkbox-label">
                  Kích hoạt mã giảm giá
                </label>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="admin__form-button" disabled={loading}>
              {loading ? 'Đang thêm...' : 'Thêm mã giảm giá'}
            </button>
          </form>

          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onConfirm={confirmAddDiscount}
            title="Vui lòng xác nhận lại"
            message={`Bạn chắc chắn muốn thêm mã giảm giá "${newDiscount.code}" này?`}
          />
        </>
      )}
    </section>
  );
};

export default AddDiscount;
