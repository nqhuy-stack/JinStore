import { Fragment } from 'react';

// import Button from '@components/ui/Button';
import CategoryList from '@components/ui/CategoryList.jsx';
import { Link } from 'react-router-dom';

import fullBanner from '@assets/images/banner/full-banner.png';
import moveRight from '@assets/icons/icon-move-right.svg';
import moveRightDark from '@assets/icons/icon-move-right-dark.svg';

function Home() {
  return (
    <Fragment>
      <section>
        <div className="home">
          <div className="home__banner">
            <img className="img-banner" src={fullBanner} alt="Banner" />
            <div className="banner__content">
              <h5 className="discount">Weekend Discount</h5>
              <h2 className="title">Get the best quality products at the lowest prices</h2>
              <p className="describe">We have prepared special discounts for you on organic breakfast products</p>

              <Link to={'/shop'} className="btn btn-shop">
                <p>Shop Now</p>
                <img src={moveRight} alt="Move Right" />
              </Link>
            </div>
          </div>
          <div className="home__section">
            <div className="section__title">
              <h1 className="title">Browse by Categories</h1>
              <Link to={'/shop'} className="btn btn-viewAll">
                <p>View All</p>
                <img src={moveRightDark} alt="Move Right" />
              </Link>
            </div>
            <CategoryList />
          </div>

          <div className="home__cashBack">
            <h1 className="cashBack-title">Get 10% Cashback! Min Order of 300.000</h1>
            <p className="cashBack-subtitle">
              Use code: <span className="code">GROCERY1920</span>
            </p>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Home;
