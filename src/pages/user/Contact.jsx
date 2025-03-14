import { Fragment } from 'react';
import img_contact from '@assets/images/ui/contact-us.png';

function Contact() {
  return (
    <Fragment>
      <section>
        <div className="contact">
          <div className="contact__header">
            <h3 className="content__title-suptext">Contact With Us</h3>
            <h1 className="content__title">You can ask us questions</h1>
            <p className="content__subtext">
              Contact us for any questions and comments.
              <br /> Or you can solve the problem faster through our contact offices.
            </p>
          </div>
          <div className="contact__content">
            <div className="content__details ">
              <img className="img-details" src={img_contact} alt="Contact with us" />
              <div className="details__office">
                <div className="office__card">
                  <p className="card-location">United States</p>
                  <h3 className="card-name">United States Office</h3>
                  <p className="card-address">205 Middle Road, 2nd Floor, New York</p>
                  <p className="card-phone">+02 1234 567 88</p>
                  <a href="mailto:info@example.com" className="card-email">
                    info@example.com
                  </a>
                </div>

                <div className="office__card">
                  <p className="card-location">Munich</p>
                  <h3 className="card-name">Munich States Office</h3>
                  <p className="card-address">205 Middle Road, 2nd Floor, New York</p>
                  <p className="card-phone">+5 456 123 22</p>
                  <a href="mailto:contact@example.com" className="card-email">
                    contact@example.com
                  </a>
                </div>
              </div>
            </div>
            <form className="contact__form">
              <div className="form__row">
                <div>
                  <label className="form__label">Your name *</label>
                  <input type="text" className="form__input" placeholder="Enter your name" required />
                </div>
                <div>
                  <label className="form__label">Your email *</label>
                  <input type="email" className="form__input" placeholder="Enter your email" required />
                </div>
              </div>

              <div className="form__field">
                <label className="form__label">Subject *</label>
                <input type="text" className="form__input" placeholder="Enter subject" required />
              </div>

              <div className="form__field">
                <label className="form__label">Your message</label>
                <textarea className="form__textarea" placeholder="Enter your message"></textarea>
              </div>

              <button type="submit" className="btn form__button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Contact;
