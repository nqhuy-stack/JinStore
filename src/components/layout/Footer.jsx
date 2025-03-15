import { Link } from 'react-router-dom';
import jsonCategories from '@json/categories';

/* import { useEffect } from 'react';
import { getCategories } from '../../services/AuthService'; */

import appStore from '@assets/images/logo/button-appstore.svg';
import appGoogle from '@assets/images/logo/button-google.svg';

import iconEmail from '@assets/icons/iconemail.svg';
import iconTelephone from '@assets/icons/icontelephone.svg';
import iconFacebook from '@assets/icons/iconfacebook.svg';
import iconInstagram from '@assets/icons/iconinstagram.svg';
import iconLinkedIn from '@assets/icons/iconLinkedIn.svg';
import iconX from '@assets/icons/icon-X.svg';

import moneyKlarna from '@assets/images/payment/money-klarna.svg';
import moneyPaypal from '@assets/images/payment/money-PayPal.svg';
import moneyVISA from '@assets/images/payment/money-VISA.svg';
import moneyMaster from '@assets/images/payment/money-Master.svg';
import moneySkrill from '@assets/images/payment/money-Skrill.svg';
// import { useState } from 'react';

const Footer = () => {
  /*   const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Goi API lay danh sach categories
        setCategory(data);
      } catch (error) {
        console.error('Loi khi lay danh muc:', error);
      }
    };
    fetchCategories();
  }, []); */

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__main">
          <div className="footer__contact">
            <h4 className="footer__contact-title">Do You Need Help ?</h4>
            <p className="footer__contact-subtext">
              We are a friendly bar serving a variety of cocktails, wines and beers. Our bar is a perfect place for a
              couple
            </p>
            <div className="footer__contact-phone">
              <img src={iconTelephone} alt="Icon Telephone" />
              <p className="footer__contact-details">
                <h5>Monday-Friday: 08am-9pm</h5>
                <h1>0 800 300-353</h1>
              </p>
            </div>
            <div className="footer__contact-email">
              <img src={iconEmail} alt="Icon Email" />
              <p className="footer__contact-details">
                <h5>Need help with your order?</h5>
                <a href="mailto:info@example.com">info@example.com</a>
              </p>
            </div>
          </div>

          <div className="footer__categories">
            <h4>Categories</h4>
            <ul>
              {jsonCategories.slice(0, 6).map((item, i) => (
                <Link key={i} to={`/shop?category=${item.name}`}>
                  {item.name}
                </Link>
              ))}
            </ul>
          </div>

          <div className="footer__useful-links">
            <h4>Useful Links</h4>
            <ul>
              <Link to="/">Home</Link>
              <Link to="/">Shop</Link>
              <Link to="/">About Us</Link>
              <Link to="/contact">Contact Us</Link>
            </ul>
          </div>

          <div className="footer__help-center">
            <h4>Help Center</h4>
            <ul>
              <Link to="/">Your Order</Link>
              <Link to="/">Your Account</Link>
              <Link to="/">Track Order</Link>
              <Link to="/">Your Wishlist</Link>
              <Link to="/">Search</Link>
              <Link to="/">FAQ</Link>
            </ul>
          </div>

          <div className="footer__app-links">
            <h4>Download our app</h4>
            <div className="download-app">
              <a
                href="https://play.google.com/store/games"
                className="btn google-play"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={appGoogle} alt="Google Play" />
                <p>
                  Download App Get <br /> -10% Discount
                </p>
              </a>
              <a
                href="https://www.apple.com/app-store/"
                className="btn app-store"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={appStore} alt="App store" />
                <p>
                  Download App Get <br /> -20% Discount
                </p>
              </a>
            </div>
            <div className="social-media">
              <h4>Follow us on social media:</h4>
              <div className="social-icons">
                <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/">
                  <img src={iconFacebook} alt="Facebook" />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/">
                  <img src={iconInstagram} alt="Instagram" />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/">
                  <img src={iconLinkedIn} alt="LinkedIn" />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/">
                  <img src={iconX} alt="X" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>
            Copyright 2024 © Jinstore WooCommerce WordPress Theme. All right reserved. Powered by
            <strong> BlackRise Themes</strong>.
          </p>
          <div className="content__right-pay">
            <img src={moneyKlarna} alt="Money Klarna"></img>
            <img src={moneyPaypal} alt="Money Paypal"></img>
            <img src={moneyVISA} alt="Money VISA"></img>
            <img src={moneyMaster} alt="Money Master"></img>
            <img src={moneySkrill} alt="Money Skrill"></img>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
