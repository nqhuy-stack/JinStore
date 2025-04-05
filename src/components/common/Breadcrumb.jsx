import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <div className="breadcrumb__container">
        <div className="breadcrumb__item breadcrumb__item--home">
          <Link to="/">
            <FontAwesomeIcon icon={faHome} className="breadcrumb__icon" />
            <span>HOME</span>
          </Link>
        </div>

        {items.map((item, index) => (
          <div key={index} className={`breadcrumb__item ${!item.link ? 'breadcrumb__item--active' : ''}`}>
            <FontAwesomeIcon icon={faChevronRight} className="breadcrumb__separator" />
            {item.link ? <Link to={item.link}>{item.text.toUpperCase()}</Link> : <span>{item.text.toUpperCase()}</span>}
          </div>
        ))}
      </div>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string,
    }),
  ).isRequired,
};

export default Breadcrumb;
