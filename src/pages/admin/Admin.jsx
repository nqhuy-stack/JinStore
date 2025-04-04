import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '@services/AuthService';
import { logoutSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import logoFull from '@assets/images/logo/logo-full.svg';
import { useState } from 'react';

const Admin = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // Lấy accessToken và id
  const id = user?._id;
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, logoutSuccess);

  // Kiểm tra nếu không có user hoặc không phải admin
  if (!user || !user.isAdmin) {
    navigate('/login', { state: { message: 'You need to be an Admin to access this page.' } });
    return null; // Tránh render giao diện khi không có quyền
  }

  const handleLogout = () => {
    logOut(dispatch, id, navigate, accessToken, axiosJWT);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`admin ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
      <header className="admin__header">
        <div className="admin__logo">
          <Link to="/admin">
            <img src={logoFull} alt="JinStore Logo" />
          </Link>
        </div>
        <div className="admin__user">
          <div className="admin__user-info">
            <span>{user.fullname || user.username}</span>
            <span className="admin__user-role">Admin</span>
          </div>
          <button className="admin__logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </header>
      <div className="admin__content">
        <aside className="admin__sidebar">
          <button className="admin__menu-toggle" onClick={toggleMenu}>
            <i className={`fas ${isMenuOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
          <ul className="admin__menu">
            <li className={`admin__menu-item ${location.pathname === '/admin' ? 'active' : ''}`}>
              <Link to="/admin">
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={`admin__menu-item ${location.pathname === '/admin/products' ? 'active' : ''}`}>
              <Link to="/admin/products">
                <i className="fas fa-box"></i>
                <span>Products</span>
              </Link>
            </li>
            <li className={`admin__menu-item ${location.pathname === '/admin/categories' ? 'active' : ''}`}>
              <Link to="/admin/categories">
                <i className="fas fa-list"></i>
                <span>Categories</span>
              </Link>
            </li>
            <li className={`admin__menu-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
              <Link to="/admin/orders">
                <i className="fas fa-shopping-cart"></i>
                <span>Orders</span>
              </Link>
            </li>
            <li className={`admin__menu-item ${location.pathname === '/admin/users' ? 'active' : ''}`}>
              <Link to="/admin/users">
                <i className="fas fa-users"></i>
                <span>Users</span>
              </Link>
            </li>
            <li className={`admin__menu-item ${location.pathname === '/admin/product-reviews' ? 'active' : ''}`}>
              <Link to="/admin/product-reviews">
                <i className="fas fa-star"></i>
                <span>Product Reviews</span>
              </Link>
            </li>
          </ul>
        </aside>
        <main className="admin__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
