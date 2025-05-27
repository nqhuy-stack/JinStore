import logoFull from '@assets/images/logo/logo-full.svg';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function FormDescribe({ children }) {
  return (
    <div className="form-describe">
      <div className="form-describe__logo">
        <Link to="/">
          <img src={logoFull} alt="GreenStore" />
        </Link>
      </div>
      <h2 className="form-describe__title">Chào mừng đến với GreenStore</h2>
      <p className="form-describe__text">
        GreenStore là nơi bạn có thể tìm thấy những sản phẩm xanh, thân thiện với môi trường. {children}
      </p>
      <Link to="/" className="btn btn__back-normal">
        <FaHome />
        Trang chủ
      </Link>
    </div>
  );
}

export default FormDescribe;
