import iconFacebookLogin from '@assets/icons/iconfacebooklogin.svg';
import iconGoogleLogin from '@assets/icons/icongooglelogin.svg';

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
