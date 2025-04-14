import iconGoogleLogin from '@assets/icons/icongooglelogin.svg';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const APP_URL = import.meta.env.VITE_APP_URL;
const API_URL = import.meta.env.VITE_API_URL;

const LINK_GET_TOKEN =
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&` +
  `response_type=token&` +
  `redirect_uri=${APP_URL}&` +
  `client_id=${GOOGLE_CLIENT_ID}`;
const GOOGLE_LOGIN_URL = `${API_URL}/auth/google`;

function SocialAccount() {
  const googleAuth = () => {
    // window.location.href = LINK_GET_TOKEN;
    window.open(GOOGLE_LOGIN_URL, '_self');
  };
  return (
    <div className="social__login-other">
      <button className="social__login-btn" onClick={googleAuth}>
        <img src={iconGoogleLogin} alt="Login With Google" />
        Google
      </button>
    </div>
  );
}

export default SocialAccount;
