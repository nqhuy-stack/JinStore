import { memo } from 'react';
import { Link } from 'react-router-dom';

function HeaderNav({dataList}) {
  return (
    <nav className="header__nav">
      <div className="header__nav-content">
        <ul className="header__menu">
          {dataList.map((item, i) => (
            <li key={i}>
              <Link to={`${item.path}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default memo(HeaderNav);
