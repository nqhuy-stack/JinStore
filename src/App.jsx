import { Routes, Route, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Page */
import Header from '@components/layout/Header.jsx';
import Footer from '@components/layout/Footer.jsx';
import routes from '@routes/routes.jsx';

const App = () => {
  const location = useLocation();
  const isPublic = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Fragment>
      {!isPublic && <Header />}
      <Routes>
        {routes.map(({ path, page: Page }, index) => (
          <Route key={index} path={path} element={<Page />} />
        ))}
      </Routes>
      {!isPublic && <Footer />}
      <ToastContainer />
    </Fragment>
  );
};

export default App;
