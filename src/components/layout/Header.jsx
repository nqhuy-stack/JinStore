import { Fragment, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import jsonNavbar from '@json/navbar.jsx';
import Button from '@components/common/utils/Button.jsx';
import HeaderNav from '@components/common/ui/HeaderNav.jsx';
import { logOut } from '@services/AuthService.jsx';
import { logoutSuccess, loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import { getCart } from '@services/CartService';
import PageLoad from '@pages/PageLoad';

import logoFull from '@assets/images/logo/logo-full.svg';
import iconLocation from '@assets/icons/iconlocation.svg';
import iconSearch from '@assets/icons/iconsearch.svg';
import iconCart from '@assets/icons/iconcart.svg';
import iconUser from '@assets/icons/iconuser.svg';
import toast from 'react-hot-toast';

const Header = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT_V2 = createAxios(user, dispatch, logoutSuccess);
  const axiosJWT_V1 = createAxios(user, dispatch, loginSuccess);

  const [lengthItems, setLengthItems] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = useCallback(async () => {
    try {
      if (user && accessToken && axiosJWT_V1) {
        const res = await getCart(accessToken, axiosJWT_V1);
        const count = res?.itemCount || 0;
        sessionStorage.setItem('itemCount', count.toString());
        setLengthItems(count);
      } else {
        const storedCount = parseInt(sessionStorage.getItem('itemCount') || '0', 10);
        setLengthItems(storedCount);
      }
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      setLengthItems(0);
    }
  }, [user, accessToken, axiosJWT_V1]);

  useEffect(() => {
    fetchCartItems(); // chạy 1 lần khi load Header
  }, [fetchCartItems]);

  // ✅ Khi mount, lắng nghe sự kiện itemCountChanged và window focus
  useEffect(() => {
    // Khi window focus (tab trở lại), cập nhật lại cart
    const handleFocus = () => {
      const storedCount = parseInt(sessionStorage.getItem('itemCount') || '0', 10);
      setLengthItems(storedCount);
    };

    // Khi có sự kiện itemCountChanged được phát ra (từ add/delete/update)
    const handleItemCountChanged = (e) => {
      setLengthItems(e.detail); // e.detail là số lượng mới
    };

    // Lần đầu mount
    handleFocus();

    // Đăng ký sự kiện
    window.addEventListener('focus', handleFocus);
    window.addEventListener('itemCountChanged', handleItemCountChanged);

    return () => {
      // Hủy đăng ký sự kiện
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('itemCountChanged', handleItemCountChanged);
    };
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logOut(dispatch, id, navigate, accessToken, axiosJWT_V2);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
    sessionStorage.removeItem('itemCount');
    window.dispatchEvent(new CustomEvent('itemCountChanged', { detail: 0 }));
    setLengthItems(0);
  }, [dispatch, id, navigate, accessToken, axiosJWT_V2]);

  const handleNoLogin = useCallback(() => {
    if (!user) {
      toast.dismiss();
      toast('Vui lòng đăng nhập', {
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 2000,
        position: 'top-center',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  }, [navigate, user]);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
    const words = name.trim().split(/\s+/);
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    return initials.join('.') + '.';
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.header__account')) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return <PageLoad zIndex={1000} />;
  }

  return (
    <Fragment>
      <header className="header">
        <section className="header__main">
          <div className="header__main-content">
            <div className="header__logo">
              <Link to="/">
                <img src={logoFull} alt="JinStore" />
              </Link>
            </div>
            <div className="header__location">
              <img src={iconLocation} alt="local" />
              <span className="header__location-text">
                Giao hàng
                <br />
                <strong>toàn quốc</strong>
              </span>
            </div>
            <div className="header__search">
              <input type="text" placeholder="Search for products, categories or brands..." />
              <Button /* onClick={} */ className="header__search-button">
                <img src={iconSearch} alt="Search Button" />
              </Button>
            </div>
            <div className="header__icons">
              {/* Nút Account */}
              <div className="header__account">
                <Button onClick={() => setIsOpen(!isOpen)} className="header__account-btn">
                  <img src={iconUser} alt="Actor" />
                  <strong>
                    {user ? (user.fullname?.trim() ? getInitials(user.fullname) : user.username) : 'Account'}
                  </strong>
                </Button>

                {/* Dropdown menu */}
                {isOpen && (
                  <div className="dropdown-menu">
                    {user ? (
                      <>
                        {user.isAdmin && (
                          <Link to="/admin" onClick={() => setIsOpen(false)}>
                            Quản lý trang web
                          </Link>
                        )}
                        <Link to="/info-user" onClick={() => setIsOpen(false)}>
                          Thông tin người dùng
                        </Link>
                        <Link onClick={handleLogout}>Đăng xuất</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Đăng nhập
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          Tạo tài khoản
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Link to={user && '/cart'} onClick={handleNoLogin}>
                <div className="header__cart">
                  <img src={iconCart} alt="icon cart-shopping" />
                  <span className="header__count">{lengthItems}</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
        <HeaderNav dataList={jsonNavbar} />
      </header>
    </Fragment>
  );
};

export default Header;
