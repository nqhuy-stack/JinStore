import iconFacebookLogin from '@assets/icons/icon-facebook-login.svg';
import iconGoogleLogin from '@assets/icons/icon-google-login.svg';

function SocialAccount() {
  return (
    <div className="social__login-other">
      <button className="social__login-btn">
        <img src={iconFacebookLogin} alt="Login With Facebook" />
        Facebook
      </button>
      <button className="social__login-btn">
        <img src={iconGoogleLogin} alt="Login With Google" />
        Google
      </button>
    </div>
  );
}

export default SocialAccount;
