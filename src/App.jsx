import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

/* Page */
import Header from '@components/layout/Header.jsx';
import Footer from '@components/layout/Footer.jsx';
import routes from '@routes/routes.jsx';

// Layout cho các trang public/user
const PublicLayout = ({ children }) => (
  <Fragment>
    <Header />
    <div className="container">{children}</div>
    <Footer />
  </Fragment>
);

// Component bảo vệ route
const ProtectedRoute = ({ children, isProtected, adminOnly }) => {
  const { currentUser } = useSelector((state) => state.auth.login);

  if (isProtected) {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    if (adminOnly && !currentUser.isAdmin) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Fragment>
      <Routes>
        {routes.map(({ path, page: Page, children, isProtected, adminOnly }, index) => {
          // Route cho admin (có sub-routes)
          if (path === '/admin') {
            return (
              <Route
                key={index}
                path={path}
                element={
                  <ProtectedRoute isProtected={isProtected} adminOnly={adminOnly}>
                    <Page />
                  </ProtectedRoute>
                }
              >
                {children &&
                  children.map(({ path: subPath, page: SubPage }, subIndex) => (
                    <Route
                      key={subIndex}
                      path={subPath}
                      element={
                        <ProtectedRoute isProtected={isProtected} adminOnly={adminOnly}>
                          <SubPage />
                        </ProtectedRoute>
                      }
                    />
                  ))}
              </Route>
            );
          }

          // Các route khác
          return (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoute isProtected={isProtected} adminOnly={adminOnly}>
                  {isPublicPage ? (
                    <Page />
                  ) : (
                    <PublicLayout>
                      <Page />
                    </PublicLayout>
                  )}
                </ProtectedRoute>
              }
            />
          );
        })}
      </Routes>
      <ToastContainer />
    </Fragment>
  );
};

export default App;
