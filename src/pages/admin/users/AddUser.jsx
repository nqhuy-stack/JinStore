import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { addUser } from '@services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '@utils/createInstance.jsx';
import { loginSuccess } from '@/redux/authSlice.jsx';
import PageLoad from '@pages/pageLoad';

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
    phone: '',
    address: '',
    dateBirth: '',
    sex: '',
    isAdmin: true,
    isActive: true,
    avatar: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
    fullname: false,
    email: false,
    phone: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({ ...newUser, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

    if (!newUser[field] && field === 'username') {
      toast.error('Vui lòng nhập tên đăng nhập', {
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

    if (!newUser[field] && field === 'password') {
      toast.error('Vui lòng nhập mật khẩu', {
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

    if (!newUser[field] && field === 'fullname') {
      toast.error('Vui lòng nhập họ tên', {
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

    if (!newUser[field] && field === 'email') {
      toast.error('Vui lòng nhập email', {
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

    if (!newUser[field] && field === 'phone') {
      toast.error('Vui lòng nhập số điện thoại', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!newUser.username) {
      toast.error('Vui lòng nhập tên đăng nhập', {
        duration: 3000,
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
      return;
    }

    if (!newUser.password) {
      toast.error('Vui lòng nhập mật khẩu', {
        duration: 3000,
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
      return;
    }

    if (!newUser.fullname) {
      toast.error('Vui lòng nhập họ tên', {
        duration: 3000,
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
      return;
    }

    if (!newUser.email) {
      toast.error('Vui lòng nhập email', {
        duration: 3000,
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
      return;
    }

    if (!newUser.phone) {
      toast.error('Vui lòng nhập số điện thoại', {
        duration: 3000,
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
      return;
    }

    const formData = new FormData();
    formData.append('username', newUser.username.trim());
    formData.append('password', newUser.password);
    formData.append('fullname', newUser.fullname.trim());
    formData.append('email', newUser.email.trim());
    formData.append('phone', newUser.phone.trim());
    formData.append('address', newUser.address.trim());
    formData.append('dateBirth', newUser.dateBirth);
    formData.append('sex', newUser.sex);
    formData.append('isAdmin', newUser.isAdmin);
    formData.append('isActive', newUser.isActive);
    if (newUser.avatar) {
      formData.append('avatar', newUser.avatar);
    }

    setLoading(true);
    try {
      await addUser(formData, dispatch, accessToken, axiosJWT);
      navigate('/admin/users');
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      toast.error('Thêm người dùng thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin__section">
      {loading ? (
        <PageLoad zIndex="1" />
      ) : (
        <>
          <div className="admin__section-header">
            <h2 className="admin__section-title">Thêm Tài Khoản Admin Mới</h2>
            <button className="admin__button admin__button--back" onClick={() => navigate('/admin/users')}>
              Quay lại
            </button>
          </div>
          <form className="admin__form" onSubmit={handleSubmit}>
            <div className="admin__form-row">
              <div className="admin__form-field">
                <label htmlFor="username">
                  Tên đăng nhập <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('username')}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
                {touchedFields.username && !newUser.username && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập tên đăng nhập
                  </div>
                )}
              </div>
              <div className="admin__form-field">
                <label htmlFor="password">
                  Mật khẩu <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="Nhập mật khẩu"
                  required
                />
                {touchedFields.password && !newUser.password && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập mật khẩu
                  </div>
                )}
              </div>
            </div>
            <div className="admin__form-row">
              <div className="admin__form-field">
                <label htmlFor="fullname">
                  Họ tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={newUser.fullname}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('fullname')}
                  placeholder="Nhập họ tên"
                  required
                />
                {touchedFields.fullname && !newUser.fullname && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập họ tên
                  </div>
                )}
              </div>
              <div className="admin__form-field">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="Nhập email"
                  required
                />
                {touchedFields.email && !newUser.email && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập email
                  </div>
                )}
              </div>
            </div>
            <div className="admin__form-row">
              <div className="admin__form-field">
                <label htmlFor="phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('phone')}
                  placeholder="Nhập số điện thoại"
                  required
                />
                {touchedFields.phone && !newUser.phone && (
                  <div className="field-error" style={{ color: '#dc3545', marginTop: '5px', fontSize: '1.4rem' }}>
                    Vui lòng nhập số điện thoại
                  </div>
                )}
              </div>
              <div className="admin__form-field">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newUser.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
            <div className="admin__form-row">
              <div className="admin__form-field">
                <label htmlFor="dateBirth">Ngày sinh</label>
                <input
                  type="date"
                  id="dateBirth"
                  name="dateBirth"
                  value={newUser.dateBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="admin__form-field">
                <label htmlFor="sex">Giới tính</label>
                <select id="sex" name="sex" value={newUser.sex} onChange={handleInputChange}>
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <div className="admin__form-row">
              <div className="admin__form-field">
                <label htmlFor="avatar">Ảnh đại diện</label>
                <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="admin__image-preview admin__image-preview--user" />
                )}
              </div>
            </div>
            <button type="submit" className="admin__form-button">
              Thêm Tài Khoản Admin
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default AddUser;
