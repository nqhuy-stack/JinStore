import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import img_404 from '@assets/images/ui/notfound.svg';

function NotFound() {
  return (
    <Fragment>
      <section>
        <div className="notfound">
          <div className="notfound__content">
            <img className="img-notfound" src={img_404} alt="Images Not Found" />
            <span className="notfound__title">That Page Cant Be Found</span>
            <p className="notfound__subtext">
              It looks like nothing was found at this location. Maybe try to search for what you are looking for?
            </p>
            <Link to="/" className="btn btn-back-home">
              Go to HomePage
            </Link>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default NotFound;
