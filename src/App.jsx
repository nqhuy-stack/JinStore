import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';

/* Page */
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import routes from '@routes/routes';

const App = () => {
  return (
    <Fragment>
      <Header />
      <div className="container">
        <Routes>
          {routes.map(({ path, page: Page }, index) => (
            <Route key={index} path={path} element={<Page />} />
          ))}
        </Routes>
      </div>
      <Footer />
    </Fragment>
  );
};

export default App;
